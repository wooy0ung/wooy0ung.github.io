---
layout:     post
title:      macOS binary system learning
author:     wooy0ung
tags:       macos
category:   note
---


>[index]  
>0x001 introduction of XNU's architecture  
>0x002 analysis of loading mach-o by dyld  
>0x003 introduce to macho format  
>0x004 macho dynamic link  
<!-- more -->


## 0x001 introduction of XNU's architecture

system's architecture
```
The User Experience layer       # ignore
The Application Frameworks layer
The Core Frameworks
Darwin                          # kernel
```

darwin's architecture
![](/assets/img/note/2018-05-05-binary-system-macos/0x001-001.png)  

XNU is darwin's kernel，a mixture of mach and bsd，mainly contains
```
Mach Micro kernel
BSD kernel
libKern
I/O Kit
```

function
```
abstract of process and thread
manager of virtual memory
adjust tasks
process communications
```

BSD's work
```
UNIX process model
POSIX process model(pthread)
manager of UNIX user and group
BSD Socket API
file system
instrucment system
```

libKern provides a C++ subset for I/O Kit，and I/O Kit is driver model framework with OOP features

what's info.plist? Every app or bundle would rely on it，it provide a property list containing: 
```
some info show to user directly
label your app or which types it can support
which system framework would use to load the app 
```

codesigned? As a iOS developer, you may have a certifica，public key and private key。In macOS, it is 
acquiescently closed, but you can open by "Gatekeeper".

Mandatory Access Control, firstly used in FreeBSD 5.x, is the basic of macOS's Sandboxing and iOS entitlement.
It can label users as well as other files with constant security property, and confirm whether a users can
access the files.

sandbox, you can see this picture with traslations
![](/assets/img/note/2018-05-05-binary-system-macos/0x001-002.png)  


## 0x002 analysis of loading mach-o by dyld

macho_header，open machostruc.h
```
struct MACHO_HEADER {
    byte    magic[4];
    uint32  cputype;
    uint32  cpusubtype;
    uint32  filetype;
    uint32  ncmds;
    uint32  sizeofcmds;
    uint32  flags;
} PACKED;

struct MACHO_HEADER64 {
    byte    magic[4];
    uint32  cputype;
    uint32  cpusubtype;
    uint32  filetype;
    uint32  ncmds;
    uint32  sizeofcmds;
    uint32  flags;
    uint32  reserved;
} PACKED;
```

and operations
![](/assets/img/note/2018-05-05-binary-system-macos/0x002-001.png)  

open ./src/ImageLoader.h
![](/assets/img/note/2018-05-05-binary-system-macos/0x002-002.png) 

iherition relations
```
ImageLoader --> ImageLoaderMachO --> ImageLoaderMachOClassic
                                 --> ImageLoaderMachOCompressed
```

open ./src/dyld.c，this part we pay attention to how to load macho file，and ignore other operations
```
//
// Entry point for dyld.  The kernel loads dyld and jumps to __dyld_start which
// sets up some registers and call this function.
//
// Returns address of main() in target program which __dyld_start jumps to
//
uintptr_t
_main(const macho_header* mainExecutableMH, uintptr_t mainExecutableSlide, 
        int argc, const char* argv[], const char* envp[], const char* apple[], 
        uintptr_t* startGlue)
{
  ... //对全局变量一通操作
    try {
        // add dyld itself to UUID list
        addDyldImageToUUIDList();
        CRSetCrashLogMessage(sLoadingCrashMessage);
        // instantiate ImageLoader for main executable
        sMainExecutable = instantiateFromLoadedImage(mainExecutableMH, mainExecutableSlide, sExecPath);//加载MACHO到image
        ... //不关心了
    }
}
```

instantiateFromLoadedImage
```
// The kernel maps in main executable before dyld gets control.  We need to 
// make an ImageLoader* for the already mapped in main executable.
static ImageLoader* instantiateFromLoadedImage(const macho_header* mh, uintptr_t slide, const char* path)
{
    // try mach-o loader
    if ( isCompatibleMachO((const uint8_t*)mh, path) ) {//检测是否合法
        ImageLoader* image = ImageLoaderMachO::instantiateMainExecutable(mh, slide, path, gLinkContext); //加载
        addImage(image);
        return image;
    }
    
    throw "main executable not a known format";
}
```

isCompatibleMachO
```
bool isCompatibleMachO(const uint8_t* firstPage, const char* path)
{
#if CPU_SUBTYPES_SUPPORTED
    // 支持检测CPU版本的情况
    // It is deemed compatible if any of the following are true:
    //  1) mach_header subtype is in list of compatible subtypes for running processor
    //  2) mach_header subtype is same as running processor subtype
    //  3) mach_header subtype runs on all processor variants
    const mach_header* mh = (mach_header*)firstPage;
    if ( mh->magic == sMainExecutableMachHeader->magic ) { 
        //传入的mach-o文件的magic是否和加载的主mach-o文件是否相同
        //这一次运行到这里的时候mh与sMainExecutableMacHeader应该是指向同一个mach-o的
        if ( mh->cputype == sMainExecutableMachHeader->cputype ) {
            if ( (mh->cputype & CPU_TYPE_MASK) == sHostCPU ) {
                //加载的mh是否在当前平台可以运行。
                // get preference ordered list of subtypes that this machine can use
                const cpu_subtype_t* subTypePreferenceList = findCPUSubtypeList(mh->cputype, sHostCPUsubtype);
                if ( subTypePreferenceList != NULL ) {
                      //如果该CPU的版本存在一个检测的列表，则进行检测
                    // if image's subtype is in the list, it is compatible
                    for (const cpu_subtype_t* p = subTypePreferenceList; *p != CPU_SUBTYPE_END_OF_LIST; ++p) {
                        if ( *p == mh->cpusubtype )
                            return true;
                    }
                    // have list and not in list, so not compatible
                    throwf("incompatible cpu-subtype: 0x%08X in %s", mh->cpusubtype, path);
                }
                // unknown cpu sub-type, but if exact match for current subtype then ok to use
                if ( mh->cpusubtype == sHostCPUsubtype ) 
                    //加载的mh与当前运行环境的CPU版本相同
                    return true;
            }
            
            // cpu type has no ordered list of subtypes
             // 这两种CPU支持所有版本的mach-o文件
            switch (mh->cputype) {
                case CPU_TYPE_I386:
                case CPU_TYPE_X86_64:
                    // subtypes are not used or these architectures
                    return true;
            }
        }
    }
#else
    // For architectures that don't support cpu-sub-types
    // this just check the cpu type.
    // 不支持检测CPU版本的时候，就只判断是mh的版本与CPU相同。
    const mach_header* mh = (mach_header*)firstPage;
    if ( mh->magic == sMainExecutableMachHeader->magic ) {
        if ( mh->cputype == sMainExecutableMachHeader->cputype ) {
            return true;
        }
    }
#endif
    return false;
}
```

CPU_TYPE & CPU_SUBTYPE are in ./src/machine.h
```
#define CPU_TYPE_ANY        ((cpu_type_t) -1)

#define CPU_TYPE_VAX        ((cpu_type_t) 1)
/* skip             ((cpu_type_t) 2)    */
/* skip             ((cpu_type_t) 3)    */
/* skip             ((cpu_type_t) 4)    */
/* skip             ((cpu_type_t) 5)    */
#define CPU_TYPE_MC680x0    ((cpu_type_t) 6)
#define CPU_TYPE_X86        ((cpu_type_t) 7)
#define CPU_TYPE_I386       CPU_TYPE_X86        /* compatibility */
#define CPU_TYPE_X86_64     (CPU_TYPE_X86 | CPU_ARCH_ABI64)

/* skip CPU_TYPE_MIPS       ((cpu_type_t) 8)    */
/* skip             ((cpu_type_t) 9)    */
#define CPU_TYPE_MC98000    ((cpu_type_t) 10)
#define CPU_TYPE_HPPA           ((cpu_type_t) 11)
#define CPU_TYPE_ARM        ((cpu_type_t) 12)
#define CPU_TYPE_ARM64          (CPU_TYPE_ARM | CPU_ARCH_ABI64)
#define CPU_TYPE_MC88000    ((cpu_type_t) 13)
#define CPU_TYPE_SPARC      ((cpu_type_t) 14)
#define CPU_TYPE_I860       ((cpu_type_t) 15)
/* skip CPU_TYPE_ALPHA      ((cpu_type_t) 16)   */
/* skip             ((cpu_type_t) 17)   */
#define CPU_TYPE_POWERPC        ((cpu_type_t) 18)
#define CPU_TYPE_POWERPC64      (CPU_TYPE_POWERPC | CPU_ARCH_ABI64)
/*
 *  Machine subtypes (these are defined here, instead of in a machine
 *  dependent directory, so that any program can get all definitions
 *  regardless of where is it compiled).
 */

/*
 * Capability bits used in the definition of cpu_subtype.
 */
#define CPU_SUBTYPE_MASK    0xff000000  /* mask for feature flags */
#define CPU_SUBTYPE_LIB64   0x80000000  /* 64 bit libraries */


/*
 *  Object files that are hand-crafted to run on any
 *  implementation of an architecture are tagged with
 *  CPU_SUBTYPE_MULTIPLE.  This functions essentially the same as
 *  the "ALL" subtype of an architecture except that it allows us
 *  to easily find object files that may need to be modified
 *  whenever a new implementation of an architecture comes out.
 *
 *  It is the responsibility of the implementor to make sure the
 *  software handles unsupported implementations elegantly.
 */
#define CPU_SUBTYPE_MULTIPLE        ((cpu_subtype_t) -1)
#define CPU_SUBTYPE_LITTLE_ENDIAN   ((cpu_subtype_t) 0)
#define CPU_SUBTYPE_BIG_ENDIAN      ((cpu_subtype_t) 1)

/*
 *     Machine threadtypes.
 *     This is none - not defined - for most machine types/subtypes.
 */
#define CPU_THREADTYPE_NONE     ((cpu_threadtype_t) 0)

/*
 *  VAX subtypes (these do *not* necessary conform to the actual cpu
 *  ID assigned by DEC available via the SID register).
 */

#define CPU_SUBTYPE_VAX_ALL ((cpu_subtype_t) 0) 
#define CPU_SUBTYPE_VAX780  ((cpu_subtype_t) 1)
#define CPU_SUBTYPE_VAX785  ((cpu_subtype_t) 2)
#define CPU_SUBTYPE_VAX750  ((cpu_subtype_t) 3)
#define CPU_SUBTYPE_VAX730  ((cpu_subtype_t) 4)
#define CPU_SUBTYPE_UVAXI   ((cpu_subtype_t) 5)
#define CPU_SUBTYPE_UVAXII  ((cpu_subtype_t) 6)
#define CPU_SUBTYPE_VAX8200 ((cpu_subtype_t) 7)
#define CPU_SUBTYPE_VAX8500 ((cpu_subtype_t) 8)
#define CPU_SUBTYPE_VAX8600 ((cpu_subtype_t) 9)
#define CPU_SUBTYPE_VAX8650 ((cpu_subtype_t) 10)
#define CPU_SUBTYPE_VAX8800 ((cpu_subtype_t) 11)
#define CPU_SUBTYPE_UVAXIII ((cpu_subtype_t) 12)
```

ImageLoaderMachO::instantiateMainExecutable
```
// create image for main executable
ImageLoader* ImageLoaderMachO::instantiateMainExecutable(const macho_header* mh, uintptr_t slide, const char* path, const LinkContext& context)
{
    //dyld::log("ImageLoader=%ld, ImageLoaderMachO=%ld, ImageLoaderMachOClassic=%ld, ImageLoaderMachOCompressed=%ld\n",
    //  sizeof(ImageLoader), sizeof(ImageLoaderMachO), sizeof(ImageLoaderMachOClassic), sizeof(ImageLoaderMachOCompressed));
    bool compressed;
    unsigned int segCount;
    unsigned int libCount;
    const linkedit_data_command* codeSigCmd;
    const encryption_info_command* encryptCmd;
    sniffLoadCommands(mh, path, false, &compressed, &segCount, &libCount, context, &codeSigCmd, &encryptCmd); //判断macho是普通的还是压缩的
    // instantiate concrete class based on content of load commands
    if ( compressed ) 
        return ImageLoaderMachOCompressed::instantiateMainExecutable(mh, slide, path, segCount, libCount, context);
    else
#if SUPPORT_CLASSIC_MACHO
        return ImageLoaderMachOClassic::instantiateMainExecutable(mh, slide, path, segCount, libCount, context);
#else
        throw "missing LC_DYLD_INFO load command";
#endif
}
```

sniffLoadCommands
```
// determine if this mach-o file has classic or compressed LINKEDIT and number of segments it has
void ImageLoaderMachO::sniffLoadCommands(const macho_header* mh, const char* path, bool inCache, bool* compressed,
                                            unsigned int* segCount, unsigned int* libCount, const LinkContext& context,
                                            const linkedit_data_command** codeSigCmd,
                                            const encryption_info_command** encryptCmd)
{
    *compressed = false;
    *segCount = 0;
    *libCount = 0;
    *codeSigCmd = NULL;
    *encryptCmd = NULL;

    const uint32_t cmd_count = mh->ncmds;
    //获取cmds的个数,保存在mach-o文件的头部ncmds字段中
    const struct load_command* const startCmds    = (struct load_command*)(((uint8_t*)mh) + sizeof(macho_header));
    //获取command段开始的地址，startCmds = mach-o地址 + mach-o头部长度
    const struct load_command* const endCmds = (struct load_command*)(((uint8_t*)mh) + sizeof(macho_header) + mh->sizeofcmds);
    //获取command段结束的地址，endCmds = mach-o地址 + mach-o头部长度 + cmds所用的长度
    const struct load_command* cmd = startCmds;
    bool foundLoadCommandSegment = false;
    for (uint32_t i = 0; i < cmd_count; ++i) {
        //遍历每一个command
        uint32_t cmdLength = cmd->cmdsize;
        struct macho_segment_command* segCmd;
        if ( cmdLength < 8 ) {
            //格式检测：长度就不对抛出异常
            dyld::throwf("malformed mach-o image: load command #%d length (%u) too small in %s",
                                               i, cmdLength, path);
        }
        const struct load_command* const nextCmd = (const struct load_command*)(((char*)cmd)+cmdLength);
        if ( (nextCmd > endCmds) || (nextCmd < cmd) ) {
            //格式检测：通过当前command长度寻找nextcmd时，如果nextcmd指不合法的位置就抛出异常
            dyld::throwf("malformed mach-o image: load command #%d length (%u) would exceed sizeofcmds (%u) in %s",
                                               i, cmdLength, mh->sizeofcmds, path);
        }
        switch (cmd->cmd) {
            //针对每种类型的command做不同的操作
            case LC_DYLD_INFO:
            case LC_DYLD_INFO_ONLY:
                *compressed = true;
                //mach-o文件为压缩的mach-o文件
                break;
            case LC_SEGMENT_COMMAND:
                segCmd = (struct macho_segment_command*)cmd;
#if __MAC_OS_X_VERSION_MIN_REQUIRED
                // rdar://problem/19617624 allow unmapped segments on OSX (but not iOS)
                // 如果segCmd的文件长度大于segCmd的vmszie，抛出异常。
                // todo:结合mach-o文件加载内核部分再详细解释
                if ( (segCmd->filesize > segCmd->vmsize) && (segCmd->vmsize != 0) )
#else
                if ( segCmd->filesize > segCmd->vmsize )
#endif
                    dyld::throwf("malformed mach-o image: segment load command %s filesize is larger than vmsize", segCmd->segname);
                // ignore zero-sized segments
                // 忽略长度为0的segments，计算segments的个数
                if ( segCmd->vmsize != 0 )
                    *segCount += 1;
                if ( context.codeSigningEnforced ) {
                    //如果有强制代码签名，则需要更加严格的segments格式合法性检测。
                    uintptr_t vmStart   = segCmd->vmaddr;
                    uintptr_t vmSize    = segCmd->vmsize;
                    uintptr_t vmEnd     = vmStart + vmSize;
                    uintptr_t fileStart = segCmd->fileoff;
                    uintptr_t fileSize  = segCmd->filesize;
                    
                    //对参数做合法性检测，如果mach-o文件不合法则抛出异常
                    if ( (intptr_t)(vmEnd) < 0)
                        dyld::throwf("malformed mach-o image: segment load command %s vmsize too large", segCmd->segname);
                    if ( vmStart > vmEnd )
                        dyld::throwf("malformed mach-o image: segment load command %s wraps around address space", segCmd->segname);
                    if ( vmSize != fileSize ) {
                        if ( (segCmd->initprot == 0) && (fileSize != 0) )
                            dyld::throwf("malformed mach-o image: unaccessable segment %s has filesize != 0", segCmd->segname);
                        else if ( vmSize < fileSize )
                            dyld::throwf("malformed mach-o image: segment %s has vmsize < filesize", segCmd->segname);
                    }
                    if ( inCache ) {
                        if ( (fileSize != 0) && (segCmd->initprot == (VM_PROT_READ | VM_PROT_EXECUTE)) ) {
                            if ( foundLoadCommandSegment )
                                throw "load commands in multiple segments";
                            foundLoadCommandSegment = true;
                        }
                    }
                    else if ( (fileStart < mh->sizeofcmds) && (fileSize != 0) ) {
                        // <rdar://problem/7942521> all load commands must be in an executable segment
                        if ( (fileStart != 0) || (fileSize < (mh->sizeofcmds+sizeof(macho_header))) )
                            dyld::throwf("malformed mach-o image: segment %s does not span all load commands", segCmd->segname); 
                        if ( segCmd->initprot != (VM_PROT_READ | VM_PROT_EXECUTE) ) 
                            dyld::throwf("malformed mach-o image: load commands found in segment %s with wrong permissions", segCmd->segname); 
                        if ( foundLoadCommandSegment )
                            throw "load commands in multiple segments";
                        foundLoadCommandSegment = true;
                    }

                    const struct macho_section* const sectionsStart = (struct macho_section*)((char*)segCmd + sizeof(struct macho_segment_command));
                    const struct macho_section* const sectionsEnd = &sectionsStart[segCmd->nsects];
                    for (const struct macho_section* sect=sectionsStart; sect < sectionsEnd; ++sect) {
                        if (!inCache && sect->offset != 0 && ((sect->offset + sect->size) > (segCmd->fileoff + segCmd->filesize)))
                            dyld::throwf("malformed mach-o image: section %s,%s of '%s' exceeds segment %s booundary", sect->segname, sect->sectname, path, segCmd->segname);
                    }
                }
                break;
            case LC_SEGMENT_COMMAND_WRONG:
                dyld::throwf("malformed mach-o image: wrong LC_SEGMENT[_64] for architecture"); 
                break;
            case LC_LOAD_DYLIB:
            case LC_LOAD_WEAK_DYLIB:
            case LC_REEXPORT_DYLIB:
            case LC_LOAD_UPWARD_DYLIB:
                *libCount += 1;
                break;
            case LC_CODE_SIGNATURE:
                *codeSigCmd = (struct linkedit_data_command*)cmd; // only support one LC_CODE_SIGNATURE per image
                break;
            case LC_ENCRYPTION_INFO:
            case LC_ENCRYPTION_INFO_64:
                *encryptCmd = (struct encryption_info_command*)cmd; // only support one LC_ENCRYPTION_INFO[_64] per image
                break;
        }
        cmd = nextCmd;
    }

    if ( context.codeSigningEnforced && !foundLoadCommandSegment )
        throw "load commands not in a segment";

    // <rdar://problem/13145644> verify every segment does not overlap another segment
    if ( context.codeSigningEnforced ) {
        //如果设置了强制代码签名，则需要更加严格的检测，确认segments没有互相覆盖。
        uintptr_t lastFileStart = 0;
        uintptr_t linkeditFileStart = 0;
        const struct load_command* cmd1 = startCmds;
        for (uint32_t i = 0; i < cmd_count; ++i) {
            if ( cmd1->cmd == LC_SEGMENT_COMMAND ) {
                struct macho_segment_command* segCmd1 = (struct macho_segment_command*)cmd1;
                uintptr_t vmStart1   = segCmd1->vmaddr;
                uintptr_t vmEnd1     = segCmd1->vmaddr + segCmd1->vmsize;
                uintptr_t fileStart1 = segCmd1->fileoff;
                uintptr_t fileEnd1   = segCmd1->fileoff + segCmd1->filesize;

                if (fileStart1 > lastFileStart)
                    lastFileStart = fileStart1;

                if ( strcmp(&segCmd1->segname[0], "__LINKEDIT") == 0 ) {
                    linkeditFileStart = fileStart1;
                }

                const struct load_command* cmd2 = startCmds;
                for (uint32_t j = 0; j < cmd_count; ++j) {
                    if ( cmd2 == cmd1 )
                        continue;
                    if ( cmd2->cmd == LC_SEGMENT_COMMAND ) {
                        struct macho_segment_command* segCmd2 = (struct macho_segment_command*)cmd2;
                        uintptr_t vmStart2   = segCmd2->vmaddr;
                        uintptr_t vmEnd2     = segCmd2->vmaddr + segCmd2->vmsize;
                        uintptr_t fileStart2 = segCmd2->fileoff;
                        uintptr_t fileEnd2   = segCmd2->fileoff + segCmd2->filesize;
                        if ( ((vmStart2 <= vmStart1) && (vmEnd2 > vmStart1) && (vmEnd1 > vmStart1)) 
                        || ((vmStart2 >= vmStart1) && (vmStart2 < vmEnd1) && (vmEnd2 > vmStart2)) )
                            dyld::throwf("malformed mach-o image: segment %s vm overlaps segment %s", segCmd1->segname, segCmd2->segname);
                        if ( ((fileStart2 <= fileStart1) && (fileEnd2 > fileStart1) && (fileEnd1 > fileStart1))
                          || ((fileStart2 >= fileStart1) && (fileStart2 < fileEnd1) && (fileEnd2 > fileStart2)) )
                            dyld::throwf("malformed mach-o image: segment %s file content overlaps segment %s", segCmd1->segname, segCmd2->segname); 
                    }
                    cmd2 = (const struct load_command*)(((char*)cmd2)+cmd2->cmdsize);
                }
            }
            cmd1 = (const struct load_command*)(((char*)cmd1)+cmd1->cmdsize);
        }

        if (lastFileStart != linkeditFileStart)
            dyld::throwf("malformed mach-o image: __LINKEDIT must be last segment");
    }

    // fSegmentsArrayCount is only 8-bits
    if ( *segCount > 255 )
        dyld::throwf("malformed mach-o image: more than 255 segments in %s", path);

    // fSegmentsArrayCount is only 8-bits
    if ( *libCount > 4095 )
        dyld::throwf("malformed mach-o image: more than 4095 dependent libraries in %s", path);

    if ( needsAddedLibSystemDepency(*libCount, mh) )
        *libCount = 1;
}
```

ImageLoaderMachOClassic::instantiateMainExecutable
```
// create image for main executable
ImageLoaderMachOClassic* ImageLoaderMachOClassic::instantiateMainExecutable(const macho_header* mh, uintptr_t slide, const char* path, 
                                                                        unsigned int segCount, unsigned int libCount, const LinkContext& context)
{
    ImageLoaderMachOClassic* image = ImageLoaderMachOClassic::instantiateStart(mh, path, segCount, libCount);
    //实例化image
    
    //为PIE设置所需的参数，Position Independent Executables
    //todo:分析了解PIE
    // set slide for PIE programs
    image->setSlide(slide);

    // for PIE record end of program, to know where to start loading dylibs
    if ( slide != 0 )
        fgNextPIEDylibAddress = (uintptr_t)image->getEnd();

    //设置一堆参数
    image->disableCoverageCheck();
    image->instantiateFinish(context);
    image->setMapped(context);

#if __i386__
    // kernel may have mapped in __IMPORT segment read-only, we need it read/write to do binding
    if ( image->fReadOnlyImportSegment ) {
        for(unsigned int i=0; i < image->fSegmentsCount; ++i) {
            if ( image->segIsReadOnlyImport(i) )
                image->segMakeWritable(i, context);
        }
    }
#endif
    
    //如果设置了context.verboseMapping，打印详细的LOG
    if ( context.verboseMapping ) {
        dyld::log("dyld: Main executable mapped %s\n", path);
        for(unsigned int i=0, e=image->segmentCount(); i < e; ++i) {
            const char* name = image->segName(i);
            if ( (strcmp(name, "__PAGEZERO") == 0) || (strcmp(name, "__UNIXSTACK") == 0)  )
                dyld::log("%18s at 0x%08lX->0x%08lX\n", name, image->segPreferredLoadAddress(i), image->segPreferredLoadAddress(i)+image->segSize(i));
            else
                dyld::log("%18s at 0x%08lX->0x%08lX\n", name, image->segActualLoadAddress(i), image->segActualEndAddress(i));
        }
    }

    return image;
}
```

instantiateStart
```
// construct ImageLoaderMachOClassic using "placement new" with SegmentMachO objects array at end
ImageLoaderMachOClassic* ImageLoaderMachOClassic::instantiateStart(const macho_header* mh, const char* path,
                                                                        unsigned int segCount, unsigned int libCount)
{
    size_t size = sizeof(ImageLoaderMachOClassic) + segCount * sizeof(uint32_t) + libCount * sizeof(ImageLoader*);
    ImageLoaderMachOClassic* allocatedSpace = static_cast<ImageLoaderMachOClassic*>(malloc(size));
    if ( allocatedSpace == NULL )
        throw "malloc failed";
    uint32_t* segOffsets = ((uint32_t*)(((uint8_t*)allocatedSpace) + sizeof(ImageLoaderMachOClassic)));
    bzero(&segOffsets[segCount], libCount*sizeof(void*));   // zero out lib array
    return new (allocatedSpace) ImageLoaderMachOClassic(mh, path, segCount, segOffsets, libCount);
}
```

ImageLoaderMachO
```
ImageLoaderMachOClassic::ImageLoaderMachOClassic(const macho_header* mh, const char* path, 
                                                    unsigned int segCount, uint32_t segOffsets[], unsigned int libCount)
 : ImageLoaderMachO(mh, path, segCount, segOffsets, libCount), fStrings(NULL), fSymbolTable(NULL), fDynamicInfo(NULL)
{
}

ImageLoaderMachO::ImageLoaderMachO(const macho_header* mh, const char* path, unsigned int segCount, 
                                                                uint32_t segOffsets[], unsigned int libCount)
 : ImageLoader(path, libCount), fCoveredCodeLength(0), fMachOData((uint8_t*)mh), fLinkEditBase(NULL), fSlide(0),
    fEHFrameSectionOffset(0), fUnwindInfoSectionOffset(0), fDylibIDOffset(0), 
fSegmentsCount(segCount), fIsSplitSeg(false), fInSharedCache(false),
#if TEXT_RELOC_SUPPORT
    fTextSegmentRebases(false),
    fTextSegmentBinds(false),
#endif
#if __i386__
    fReadOnlyImportSegment(false),
#endif
    fHasSubLibraries(false), fHasSubUmbrella(false), fInUmbrella(false), fHasDOFSections(false), fHasDashInit(false),
    fHasInitializers(false), fHasTerminators(false), fRegisteredAsRequiresCoalescing(false)
{
    fIsSplitSeg = ((mh->flags & MH_SPLIT_SEGS) != 0);        

    // construct SegmentMachO object for each LC_SEGMENT cmd using "placement new" to put 
    // each SegmentMachO object in array at end of ImageLoaderMachO object
    const uint32_t cmd_count = mh->ncmds;
    const struct load_command* const cmds = (struct load_command*)&fMachOData[sizeof(macho_header)];
    const struct load_command* cmd = cmds;
    for (uint32_t i = 0, segIndex=0; i < cmd_count; ++i) {
        if ( cmd->cmd == LC_SEGMENT_COMMAND ) {
            const struct macho_segment_command* segCmd = (struct macho_segment_command*)cmd;
            // ignore zero-sized segments
            if ( segCmd->vmsize != 0 ) {
                // record offset of load command
                segOffsets[segIndex++] = (uint32_t)((uint8_t*)segCmd - fMachOData);
            }
        }
        cmd = (const struct load_command*)(((char*)cmd)+cmd->cmdsize);
    }

}
```

addimage
```
static void addImage(ImageLoader* image)
{
    // add to master list
    // 对所有images的容器原子添加image
    allImagesLock();
        sAllImages.push_back(image);
    allImagesUnlock();
    
    // update mapped ranges
    // 更新内存分布的数据
    uintptr_t lastSegStart = 0;
    uintptr_t lastSegEnd = 0;
    for(unsigned int i=0, e=image->segmentCount(); i < e; ++i) {
        if ( image->segUnaccessible(i) ) 
            continue;
        uintptr_t start = image->segActualLoadAddress(i);
        uintptr_t end = image->segActualEndAddress(i);
        if ( start == lastSegEnd ) {
            // two segments are contiguous, just record combined segments
            lastSegEnd = end;
        }
        else {
            // non-contiguous segments, record last (if any)
            if ( lastSegEnd != 0 )
                addMappedRange(image, lastSegStart, lastSegEnd);
            lastSegStart = start;
            lastSegEnd = end;
        }       
    }
    if ( lastSegEnd != 0 )
        addMappedRange(image, lastSegStart, lastSegEnd);

    
    if ( sEnv.DYLD_PRINT_LIBRARIES || (sEnv.DYLD_PRINT_LIBRARIES_POST_LAUNCH && (sMainExecutable!=NULL) && sMainExecutable->isLinked()) ) {
        dyld::log("dyld: loaded: %s\n", image->getPath());
    }
    
}
```

0x003 introduce to macho format

Mach-O structure
![](/assets/img/note/2018-05-05-binary-system-macos/0x003-001.png)  

Mach-O header
```
/*
 * The 32-bit mach header appears at the very beginning of the object file for
 * 32-bit architectures.
 */
struct mach_header {
    uint32_t    magic;      /* mach magic number identifier */
    cpu_type_t  cputype;    /* cpu specifier */
    cpu_subtype_t   cpusubtype; /* machine specifier */
    uint32_t    filetype;   /* type of file */
    uint32_t    ncmds;      /* number of load commands */
    uint32_t    sizeofcmds; /* the size of all the load commands */
    uint32_t    flags;      /* flags */
};

/* Constant for the magic field of the mach_header (32-bit architectures) */
#define MH_MAGIC    0xfeedface  /* the mach magic number */
#define MH_CIGAM    0xcefaedfe  /* NXSwapInt(MH_MAGIC) */

/*
 * The 64-bit mach header appears at the very beginning of object files for
 * 64-bit architectures.
 */
struct mach_header_64 {
    uint32_t    magic;      /* mach magic number identifier */
    cpu_type_t  cputype;    /* cpu specifier */
    cpu_subtype_t   cpusubtype; /* machine specifier */
    uint32_t    filetype;   /* type of file */
    uint32_t    ncmds;      /* number of load commands */
    uint32_t    sizeofcmds; /* the size of all the load commands */
    uint32_t    flags;      /* flags */
    uint32_t    reserved;   /* reserved */
};

/* Constant for the magic field of the mach_header_64 (64-bit architectures) */
#define MH_MAGIC_64 0xfeedfacf /* the 64-bit mach magic number */
#define MH_CIGAM_64 0xcffaedfe /* NXSwapInt(MH_MAGIC_64) */
```

check Mach-O headers on a file by otool
```
$ otool -h ht
Mach header
      magic cputype cpusubtype  caps    filetype ncmds sizeofcmds      flags
 0xfeedfacf 16777223          3  0x80           2    18       2080 0x00218085
```

filetype can label exec、lib、coredump and so on...
````
#define MH_OBJECT   0x1     /* relocatable object file */
#define MH_EXECUTE  0x2     /* demand paged executable file */
#define MH_FVMLIB   0x3     /* fixed VM shared library file */
#define MH_CORE     0x4     /* core file */
#define MH_PRELOAD  0x5     /* preloaded executable file */
#define MH_DYLIB    0x6     /* dynamically bound shared library */
#define MH_DYLINKER 0x7     /* dynamic link editor */
#define MH_BUNDLE   0x8     /* dynamically bound bundle file */
#define MH_DYLIB_STUB   0x9     /* shared library stub for static */
                    /*  linking only, no section contents */
#define MH_DSYM     0xa     /* companion file with only debug */
                    /*  sections */
#define MH_KEXT_BUNDLE  0xb     /* x86_64 kexts */
```

flags label dyld loading parameter
```
// EXTERNAL_HEADERS/mach-o/x86_64/loader.h
#define MH_INCRLINK 0x2     /* the object file is the output of an
                       incremental link against a base file
                       and can't be link edited again */
#define MH_DYLDLINK 0x4     /* the object file is input for the
                       dynamic linker and can't be staticly
                       link edited again */
#define MH_BINDATLOAD   0x8     /* the object file's undefined
                       references are bound by the dynamic
                       linker when loaded. */
#define MH_PREBOUND 0x10        /* the file has its dynamic undefined
                       references prebound. */
#define MH_SPLIT_SEGS   0x20        /* the file has its read-only and
                       read-write segments split */
#define MH_LAZY_INIT    0x40        /* the shared library init routine is
                       to be run lazily via catching memory
                       faults to its writeable segments
                       (obsolete) */
#define MH_TWOLEVEL 0x80        /* the image is using two-level name
                       space bindings */
...
```

load_command structure
```
struct load_command {
    uint32_t cmd;       /* type of load command */
    uint32_t cmdsize;   /* total size of command in bytes */
};

after loading header，load_command would reslove to load macho data by kernel
```
static
load_return_t
parse_machfile(
    struct vnode        *vp,       
    vm_map_t        map,
    thread_t        thread,
    struct mach_header  *header,
    off_t           file_offset,
    off_t           macho_size,
    int         depth,
    int64_t         aslr_offset,
    int64_t         dyld_aslr_offset,
    load_result_t       *result
)
{
    [...] //此处省略大量初始化与检测

        /*
         * Loop through each of the load_commands indicated by the
         * Mach-O header; if an absurd value is provided, we just
         * run off the end of the reserved section by incrementing
         * the offset too far, so we are implicitly fail-safe.
         */
        offset = mach_header_sz;
        ncmds = header->ncmds;

        while (ncmds--) {
            /*
             *  Get a pointer to the command.
             */
            lcp = (struct load_command *)(addr + offset);
            //lcp设为当前要解析的cmd的地址
            oldoffset = offset;
            //oldoffset是从macho文件内存开始的地方偏移到当前command的偏移量
            offset += lcp->cmdsize;
            //重新计算offset，再加上当前command的长度，offset的值为文件内存起始地址到下一个command的偏移量
            /*
             * Perform prevalidation of the struct load_command
             * before we attempt to use its contents.  Invalid
             * values are ones which result in an overflow, or
             * which can not possibly be valid commands, or which
             * straddle or exist past the reserved section at the
             * start of the image.
             */
            if (oldoffset > offset ||
                lcp->cmdsize < sizeof(struct load_command) ||
                offset > header->sizeofcmds + mach_header_sz) {
                ret = LOAD_BADMACHO;
                break;
            }
            //做了一个检测，与如何加载进入内存无关

            /*
             * Act on struct load_command's for which kernel
             * intervention is required.
             */
            switch(lcp->cmd) {
            case LC_SEGMENT:
                [...]
                ret = load_segment(lcp,
                                   header->filetype,
                                   control,
                                   file_offset,
                                   macho_size,
                                   vp,
                                   map,
                                   slide,
                                   result);
                break;
            case LC_SEGMENT_64:
                [...]
                ret = load_segment(lcp,
                                   header->filetype,
                                   control,
                                   file_offset,
                                   macho_size,
                                   vp,
                                   map,
                                   slide,
                                   result);
                break;
            case LC_UNIXTHREAD:
                if (pass != 1)
                    break;
                ret = load_unixthread(
                         (struct thread_command *) lcp,
                         thread,
                         slide,
                         result);
                break;
            case LC_MAIN:
                if (pass != 1)
                    break;
                if (depth != 1)
                    break;
                ret = load_main(
                         (struct entry_point_command *) lcp,
                         thread,
                         slide,
                         result);
                break;
            case LC_LOAD_DYLINKER:
                if (pass != 3)
                    break;
                if ((depth == 1) && (dlp == 0)) {
                    dlp = (struct dylinker_command *)lcp;
                    dlarchbits = (header->cputype & CPU_ARCH_MASK);
                } else {
                    ret = LOAD_FAILURE;
                }
                break;
            case LC_UUID:
                if (pass == 1 && depth == 1) {
                    ret = load_uuid((struct uuid_command *) lcp,
                            (char *)addr + mach_header_sz + header->sizeofcmds,
                            result);
                }
                break;
            case LC_CODE_SIGNATURE:
                [...]
                ret = load_code_signature(
                    (struct linkedit_data_command *) lcp,
                    vp,
                    file_offset,
                    macho_size,
                    header->cputype,
                    result);
                [...]
                break;
#if CONFIG_CODE_DECRYPTION
            case LC_ENCRYPTION_INFO:
            case LC_ENCRYPTION_INFO_64:
                if (pass != 3)
                    break;
                ret = set_code_unprotect(
                    (struct encryption_info_command *) lcp,
                    addr, map, slide, vp, file_offset,
                    header->cputype, header->cpusubtype);
                if (ret != LOAD_SUCCESS) {
                    printf("proc %d: set_code_unprotect() error %d "
                           "for file \"%s\"\n",
                           p->p_pid, ret, vp->v_name);
                    /* 
                     * Don't let the app run if it's 
                     * encrypted but we failed to set up the
                     * decrypter. If the keys are missing it will
                     * return LOAD_DECRYPTFAIL.
                     */
                     if (ret == LOAD_DECRYPTFAIL) {
                        /* failed to load due to missing FP keys */
                        proc_lock(p);
                        p->p_lflag |= P_LTERM_DECRYPTFAIL;
                        proc_unlock(p);
                     }
                     psignal(p, SIGKILL);
                }
                break;
#endif
            default:
                /* Other commands are ignored by the kernel */
                ret = LOAD_SUCCESS;
                break;
            }
            if (ret != LOAD_SUCCESS)
                break;
        }
        if (ret != LOAD_SUCCESS)
            break;
    }

    [...] //此处略去加载之后的处理代码
}
```

cmdsize segment
```
...
lcp = (struct load_command *)(addr + offset);
//lcp设为当前要解析的cmd的地址
oldoffset = offset;
//oldoffset是从macho文件内存开始的地方偏移到当前command的偏移量
offset += lcp->cmdsize;
//重新计算offset，再加上当前command的长度，offset的值为文件内存起始地址到下一个command的偏移量
...
```

cmd segment
```
switch(lcp->cmd) {
            case LC_SEGMENT:
                [...]
                ret = load_segment(lcp,
                                   header->filetype,
                                   control,
                                   file_offset,
                                   macho_size,
                                   vp,
                                   map,
                                   slide,
                                   result);
                break;
            case LC_SEGMENT_64:
                [...]
                ret = load_segment(lcp,
                                   header->filetype,
                                   control,
                                   file_offset,
                                   macho_size,
                                   vp,
                                   map,
                                   slide,
                                   result);
                break;
            case LC_UNIXTHREAD:
                if (pass != 1)
                    break;
                ret = load_unixthread(
                         (struct thread_command *) lcp,
                         thread,
                         slide,
                         result);
                break;
            case LC_MAIN:
                if (pass != 1)
                    break;
                if (depth != 1)
                    break;
                ret = load_main(
                         (struct entry_point_command *) lcp,
                         thread,
                         slide,
                         result);
                break;
            case LC_LOAD_DYLINKER:
                if (pass != 3)
                    break;
                if ((depth == 1) && (dlp == 0)) {
                    dlp = (struct dylinker_command *)lcp;
                    dlarchbits = (header->cputype & CPU_ARCH_MASK);
                } else {
                    ret = LOAD_FAILURE;
                }
                break;
            case LC_UUID:
                if (pass == 1 && depth == 1) {
                    ret = load_uuid((struct uuid_command *) lcp,
                            (char *)addr + mach_header_sz + header->sizeofcmds,
                            result);
                }
                break;
            case LC_CODE_SIGNATURE:
                [...]
                ret = load_code_signature(
                    (struct linkedit_data_command *) lcp,
                    vp,
                    file_offset,
                    macho_size,
                    header->cputype,
                    result);
                [...]
                break;
#if CONFIG_CODE_DECRYPTION
            case LC_ENCRYPTION_INFO:
            case LC_ENCRYPTION_INFO_64:
                if (pass != 3)
                    break;
                ret = set_code_unprotect(
                    (struct encryption_info_command *) lcp,
                    addr, map, slide, vp, file_offset,
                    header->cputype, header->cpusubtype);
                if (ret != LOAD_SUCCESS) {
                    printf("proc %d: set_code_unprotect() error %d "
                           "for file \"%s\"\n",
                           p->p_pid, ret, vp->v_name);
                    /* 
                     * Don't let the app run if it's 
                     * encrypted but we failed to set up the
                     * decrypter. If the keys are missing it will
                     * return LOAD_DECRYPTFAIL.
                     */
                     if (ret == LOAD_DECRYPTFAIL) {
                        /* failed to load due to missing FP keys */
                        proc_lock(p);
                        p->p_lflag |= P_LTERM_DECRYPTFAIL;
                        proc_unlock(p);
                     }
                     psignal(p, SIGKILL);
                }
                break;
#endif
            default:
                /* Other commands are ignored by the kernel */
                ret = LOAD_SUCCESS;
                break;
            }
```

segment
```
struct segment_command { /* for 32-bit architectures */
    uint32_t    cmd;        /* LC_SEGMENT */
    uint32_t    cmdsize;    /* includes sizeof section structs */
    char        segname[16];    /* segment name */
    uint32_t    vmaddr;     /* memory address of this segment */
    uint32_t    vmsize;     /* memory size of this segment */
    uint32_t    fileoff;    /* file offset of this segment */
    uint32_t    filesize;   /* amount to map from the file */
    vm_prot_t   maxprot;    /* maximum VM protection */
    vm_prot_t   initprot;   /* initial VM protection */
    uint32_t    nsects;     /* number of sections in segment */
    uint32_t    flags;      /* flags */
};


struct segment_command_64 { /* for 64-bit architectures */
    uint32_t    cmd;        /* LC_SEGMENT_64 */
    uint32_t    cmdsize;    /* includes sizeof section_64 structs */
    char        segname[16];    /* segment name */
    uint64_t    vmaddr;     /* memory address of this segment */
    uint64_t    vmsize;     /* memory size of this segment */
    uint64_t    fileoff;    /* file offset of this segment */
    uint64_t    filesize;   /* amount to map from the file */
    vm_prot_t   maxprot;    /* maximum VM protection */
    vm_prot_t   initprot;   /* initial VM protection */
    uint32_t    nsects;     /* number of sections in segment */
    uint32_t    flags;      /* flags */
};
```

section
```
struct section { /* for 32-bit architectures */
    char        sectname[16];   /* name of this section */
    char        segname[16];    /* segment this section goes in */
    uint32_t    addr;       /* memory address of this section */
    uint32_t    size;       /* size in bytes of this section */
    uint32_t    offset;     /* file offset of this section */
    uint32_t    align;      /* section alignment (power of 2) */
    uint32_t    reloff;     /* file offset of relocation entries */
    uint32_t    nreloc;     /* number of relocation entries */
    uint32_t    flags;      /* flags (section type and attributes)*/
    uint32_t    reserved1;  /* reserved (for offset or index) */
    uint32_t    reserved2;  /* reserved (for count or sizeof) */
};

struct section_64 { /* for 64-bit architectures */
    char        sectname[16];   /* name of this section */
    char        segname[16];    /* segment this section goes in */
    uint64_t    addr;       /* memory address of this section */
    uint64_t    size;       /* size in bytes of this section */
    uint32_t    offset;     /* file offset of this section */
    uint32_t    align;      /* section alignment (power of 2) */
    uint32_t    reloff;     /* file offset of relocation entries */
    uint32_t    nreloc;     /* number of relocation entries */
    uint32_t    flags;      /* flags (section type and attributes)*/
    uint32_t    reserved1;  /* reserved (for offset or index) */
    uint32_t    reserved2;  /* reserved (for count or sizeof) */
    uint32_t    reserved3;  /* reserved */
};
```

section examples
```
Section         function
__text          code
__cstring       constant string
__const const   variable
__DATA.__bss    bss segment
```


## 0x004 macho dynamic link