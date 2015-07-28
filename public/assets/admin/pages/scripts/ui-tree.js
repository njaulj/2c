var UITree = function () {






     var ajaxTreeSample = function() {

        $("#tree_4")
            .jstree({
            "core" : {
                "themes" : {
                    "responsive": false
                }, 
                // so that create works
                "check_callback" : true,
                'data' : {
                    'url' : function (node) {
                      return '/admin/group/tree';
                    },
                    'data' : function (node) {
                      return { 'parent' : node.id };
                    }
                }
            },
            "types" : {
                "default" : {
                    "icon" : "fa fa-folder icon-state-warning icon-lg"
                },
                "file" : {
                    "icon" : "fa fa-file icon-state-warning icon-lg"
                }
            },
            "plugins" : [ "types" ]
        })
            .on("select_node.jstree", function (event, data) {
                //console.log(data)
                $("#group").val(data.selected[0])
                $("#groupname").val(data.node.text)
            })

     }


    return {
        //main function to initiate the module
        init: function () {

            ajaxTreeSample();

        }

    };

}();