function ecampusMenuCreator(mentItems) {
    this.clearMenuItems = () => {
        if ($("#dashboard_link").length > 0) {
            var myDashTop = $("#dashboard_link");
            while (myDashTop.next().length > 0) {
                if (myDashTop.next()[0].innerText == "GENERAL")
                    break;
                myDashTop.next().remove();
            }
        }
    };
    this.createMenus = (items, isSubMenu = false, outObj = null) => {
        if (outObj == null)
            outObj = $("<div/>");
        var idxArr = this.getIndexArray(items);
        if (idxArr.length > 0) {
            for (var idx in idxArr) {
                var obj = this.getMenuItem(items, idxArr[idx]);
                var menuObj = this.readMenuArray(obj, isSubMenu, obj.hasOwnProperty("submenus"));
                if (obj.hasOwnProperty("submenus")) {
                    this.createMenus(obj["submenus"], true, menuObj.find(".menu-sub"));
                }
                outObj.append(menuObj);
            }
        }
        return outObj;
    };

    this.getIndexArray = (obj) => {
        var idxArr = [];
        if (Array.isArray(obj)) {
            for (var idx in obj) {
                idxArr.push(parseInt(idx));
            }

        } else {
            for (var idx in obj) {
                if (obj[idx].hasOwnProperty("index"))
                    idxArr.push(obj[idx].index);
            }
        }

        return idxArr;
    };
    this.getMenuItem = (obj, index) => {
        var idxArr = [];
        if (Array.isArray(obj))
            return obj[index];
        else {
            for (var idx in obj) {
                if (obj[idx]["index"] == index)
                    return obj[idx];
            }
        }
        return null;
    };
    this.readMenuArray = (obj, isSubMenu = false, hasSubMenu = false) => {
        var menuObj = null;
        var subMenu = '<span class="menu-arrow"></span>';
        var icon = "";
        if (obj.hasOwnProperty("icon"))
            icon = `<span class="menu-icon">
                    <i class="${obj.icon}"></i>
                </span>`;
        if (!hasSubMenu)
            subMenu = "";
        if (isSubMenu) {
            menuObj = $(`<div class="menu-item">
            <a class="menu-link" href="#" >
                ${icon}
                <span class="menu-bullet">
                    <span class="bullet bullet-dot"></span>
                </span>
                <span class="menu-title"></span>
                ${subMenu}
            </a>
        </div>`);
        } else {
            menuObj = $(`<div data-kt-menu-trigger="click" class="menu-item menu-accordion">
        <span class="menu-link">
            ${icon}
            <span class="menu-title"></span>
            <span class="menu-arrow"></span>
        </span>
        <div class="menu-sub menu-sub-accordion menu-active-bg">
        </div>
    </div>`);
        }
        if (obj.hasOwnProperty("title"))
            menuObj.find(".menu-title").html(obj.title);
        if (obj.hasOwnProperty("link")) {
            menuObj.find(".menu-link").unbind("click");
            menuObj.find(".menu-link").attr("onclick", obj.link);
        }
        return menuObj;
    };
    this.clearMenuItems();
    return this.createMenus(mentItems);
}