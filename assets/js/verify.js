(function(){
    if (CryptoJS.MD5(CryptoJS.MD5(CryptoJS.MD5(prompt('请输入文章密码','')).toString()).toString()).toString() !== '376e433440a8723b4137eff4510b1fb4'){
        window.location.href = "../../../../";
        alert('密码错误！');
    }
})();