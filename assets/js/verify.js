(function(){
    if ((CryptoJS.MD5(prompt('请输入文章密码','')).toString()) !== '7578abdc9d2318f7326afd3f6a38e379'){
        window.location.href = "../../../../";
        alert('密码错误！');
    }
})();