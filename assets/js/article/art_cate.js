$(function() {
    initArtCateList()
    var layer = layui.layer
    var form = layui.form
        // var open = layui.open

    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败！')
                } else {
                    var htmlStr = template('tpl-table', res)
                    $('tbody').html(htmlStr)
                }

            }
        })
    }

    var index = null;
    //给添加类别按钮绑定点击事件 弹出层
    $('#btnAddCate').on('click', function() {
        index = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    })

    //通过代理形式，为form表单绑定submit事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $('#form-add').serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    layer.msg('新增分类失败！')
                } else {
                    console.log(res);
                    initArtCateList()
                    layer.msg('新增分类成功')
                    layer.close(index)
                }
            }
        })
    })

    //通过代理形式，为btn_add表单绑定点击事件
    var indexEdit = null
    $('tbody').on('click', '#btn_add', function() {
        // console.log('ok');
        //弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });
        var id = $(this).attr('data-id')
            // console.log(id)
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                // console.log(res);
                form.val('form-edit', res.data)
            }
        })
    })

    //通过代理形式，为修改分类表单绑定submit事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更改失败')
                } else {
                    initArtCateList()
                    layer.close(indexEdit)
                        // console.log(res);
                }
                // console.log(res);

            }
        })
    })

    //通过代理形式，为删除分类表单绑定点击事件
    $('tbody').on('click', '#btn_delete', function() {
        // console.log(111);
        var id = $(this).attr('data-id')
            //提示用户是否删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败')
                    }
                    layer.msg('删除成功')
                    layer.close(index);
                    initArtCateList()
                }
            })

        });

    })
})