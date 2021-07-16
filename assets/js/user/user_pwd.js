$(function() {
    var form = layui.form


    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        //旧密码不能一样
        samePwd: function(value) {
            if (value === $('#oldPwd').val()) {
                return '新旧密码不能一样'
            }
        },
        //再次输入密码
        rePwd: function(value) {
            if (value !== $('#newPwd').val()) {
                return '两次密码不一致'
            }
        }

    })
    $('.layui-form').submit(function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('更改密码失败！')
                }
                layer.msg('密码更改成功！')
                    //重置表单
                $('.layui-form')[0].reset()
                    // $('#btnReset').click()
            }
        })
    })

})