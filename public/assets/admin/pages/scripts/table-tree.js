var TableTree = function() {

    var demo1 = function() {

        jQuery('#gtreetable').gtreetable({
            'manyroots':true,
             'draggable': true,
            'source': function(id) {
                return {
                    type: 'GET',
                    url: '/admin/group/show',
                    data: {
                        'id': id
                    },
                    dataType: 'json',
                    error: function(XMLHttpRequest) {
                        alert(XMLHttpRequest.status + ': ' + XMLHttpRequest.responseText);
                    }
                }
            },
              'onSave':function (oNode) {
                return {
                  type: 'POST',
                  url: !oNode.isSaved() ? 'create' : 'update?id=' + oNode.getId(),
                  data: {
                    parent: oNode.getParent(),
                    name: oNode.getName(),
                    position: oNode.getInsertPosition(),
                    related: oNode.getRelatedNodeId()
                  },

                    headers:{
                    'x-csrf-token':$('#csrf').val()
                     },
                  dataType: 'json',
                  error: function(XMLHttpRequest) {
                    alert(XMLHttpRequest.status+': '+XMLHttpRequest.responseText);
                  }
                };
              },
              'onDelete':function (oNode) {
                return {
                  type: 'POST',
                  url: 'delete?id=' + oNode.getId(),

                    headers:{
                    'x-csrf-token':$('#csrf').val()
                     },
                  dataType: 'json',
                  error: function(XMLHttpRequest) {
                    alert(XMLHttpRequest.status+': '+XMLHttpRequest.responseText);
                  }
                };
              },
            'types': { default: 'glyphicon glyphicon-folder-open', folder: 'glyphicon glyphicon-folder-open'},
            'inputWidth': '255px'
        });
    }

    return {

        //main function to initiate the module
        init: function() {

            demo1();
        }

    };

}();