this.jd = this.jd||{};
(function(){
    var SubCommon = function()
    {
        //this.init();
        this.createCommonElement();
    };

    var p = SubCommon.prototype;

    p.init= function()
    {
         if (self != top)
        {
            //当前页面被iframe
            if($('#wbstSubFrame', parent.document).length ==0)
            {
                this.createCommonElement();
            }
        }
        else
        {
            //当前页面没有被iframe

            this.createCommonElement();
        }
    };

    //创建页面单独呈现时需要的框架中的元素，如 背景图、logo 等
    p.createCommonElement = function()
    {
    };

    jd.SubCommon = SubCommon;
})();