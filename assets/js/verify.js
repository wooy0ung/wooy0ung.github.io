(function(){
    if (CryptoJS.MD5(prompt('请输入文章密码','')).toString() !== 'c3da3d2af39eff6584444fbae78136a7'){
        window.location.href = "../../../../";
        alert('密码错误！');
    }
})();