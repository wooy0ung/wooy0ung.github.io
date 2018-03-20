---
layout:     post
title:      JarvisOJ Smali
author:     wooy0ung
tags: 		re
category:  	writeup
---


>Problem Address:  
>https://www.jarvisoj.com  
>  
>Problem Description:  
>都说学好Smali是学习Android逆向的基础，现在刚好有一个smali文件，大家一起分析一下吧~~   
>  
>Download:  
>https://dn.jarvisoj.com/challengefiles/Crackme.smali.36e0f9d764bb17e86d3d0acd49786a18  
<!-- more -->


拿到*.smali文件, 用Smali2Java工具转成*.java

```
package net.bluelotus.tomorrow.easyandroid;

import android.util.Base64;
import java.io.PrintStream;
import java.security.NoSuchAlgorithmException;
import javax.crypto.NoSuchPaddingException;
import java.security.InvalidKeyException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.BadPaddingException;
import javax.crypto.spec.SecretKeySpec;
import javax.crypto.Cipher;
import java.security.Key;
import java.security.GeneralSecurityException;

public class Crackme {
    private String str2 = "cGhyYWNrICBjdGYgMjAxNg==";
    
    public Crackme() {
        GetFlag("sSNnx1UKbYrA1+MOrdtDTA==");
    }
    
    private String GetFlag(String p1) {
        byte[] "content" = Base64.decode(p1.getBytes(), 0x0);
        String "kk" = new String(Base64.decode(str2.getBytes(), 0x0));
        System.out.println(decrypt("content", "kk"));
        return null;
    }
    
    private String decrypt(byte[] p1, String p2) {
        String "m" = 0x0;
        try {
            byte[] "keyStr" = p2.getBytes();
            SecretKeySpec "key" = new SecretKeySpec("keyStr", "AES");
            Cipher "cipher" = Cipher.getInstance("AES/ECB/NoPadding");
            "cipher".init(0x2, "key");
            byte[] "result" = "cipher".doFinal(p1);
            return "m";
        } catch(NoSuchPaddingException "e") {
            "e".printStackTrace();
        }
        return  "m";
    }
}
```

可以看到是AES加密

```
key=Base64.decode("cGhyYWNrICBjdGYgMjAxNg==")
enc=Base64.decode("sSNnx1UKbYrA1+MOrdtDTA==")
```

直接解密

```
from Crypto.Cipher import AES
 
key='cGhyYWNrICBjdGYgMjAxNg=='.decode('base64')
enc='sSNnx1UKbYrA1+MOrdtDTA=='.decode('base64')

cryptor=AES.new(key,AES.MODE_ECB)
plain=cryptor.decrypt(enc)
print plain
```

get flag~

![](/assets/img/writeup/re/2017-10-12-jarvisoj-smali/0x00.png)