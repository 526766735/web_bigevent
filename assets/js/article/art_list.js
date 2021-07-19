$(function() {

    //只有执行了这一步，部分表单元素才会自动修饰成功
    var form = layui.form;
    var laypage = layui.laypage;

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }

    initTable()
    initCate()
    var layer = layui.layer

    //获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                //使用模板引擎渲染页面
                // console.log(res);
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)

                //调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }

    //初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败！')
                }
                //调用模板引擎渲染分类可选项
                var htmlStr = template('tpl-cate', res)
                    // console.log(htmlStr);
                $('#cate_id').html(htmlStr)
                    //通过layuiu重新渲染
                form.render();
            }

        })
    }

    //为筛选表单绑定submit事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault()
            //获取表单中选中的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()

        // 为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id
        q.state = state

        // 根据最新的筛选条件，重新渲染表格的数据
        initTable()
    })

    //定义渲染分页的方法
    function renderPage(total) {
        // console.log(total);
        laypage.render({
            //注意，这里的 test1 是 ID，不用加 # 号
            elem: 'pageBox',
            //数据总数，从服务端得到
            count: total,
            //每页显示多少条数据
            limit: q.pagesize,
            //默认被选中的分页
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            //分页发生切换时，触发jump
            jump: function(obj, first) {
                // console.log(obj.curr);
                //把最新的页码值赋值到q
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                if (!first) {
                    initTable()
                }

            }
        });
    }

    //通过代理的形式，为删除按钮绑定点击事件
    $('tbody').on('click', '#btn-delete', function() {

        // })
        // $('#btn-delete').on('click', function() {
        //获取按钮的个数
        var len = $('.btn-delete').length
            //获取到文章的id
        var id = $(this).attr('data-id')
            // console.log(11);
            //询问用户是否删除数据
        layer.confirm('是否删除？', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {

                        console.log(res);
                        return layer.msg('删除失败')
                    }
                    layer.msg('删除文章成功')
                        //删除数据后，判断本页是否还有数据，mei'you'shu'j则让页码值减一
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index);
        });
    })


})