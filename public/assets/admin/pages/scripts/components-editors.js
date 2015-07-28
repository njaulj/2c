var ComponentsEditors = function () {
    
    var handleWysihtml5 = function () {
        if (!jQuery().wysihtml5) {
            return;
        }

        if ($('.wysihtml5').size() > 0) {
            $('.wysihtml5').wysihtml5({
                "stylesheets": ["../../assets/global/plugins/bootstrap-wysihtml5/wysiwyg-color.css"]
            });
        }
    }
   function sendFile(file, editor, $editable){
       data = new FormData();
       data.append("file", file);
       url = "/admin/pic/desp";
       $.ajax({
           data: data,
           type: "POST",
           url: url,
           cache: false,
           headers:{
               'x-csrf-token':$('#csrf').val()
           },
           contentType: false,
           processData: false,
           success: function (data) {
            //   console.log(data)
               editor.insertImage($editable, data.url);
           },
           error:function(data){
             //  console.log(data)
               editor.insertImage($editable, data.url);
           }
       });
    }

    var handleSummernote = function () {
        $('#summernote_1').summernote({height: 300,onImageUpload: function(files, editor, $editable) {
            sendFile(files[0],editor,$editable);
        }});
        //API:
        //var sHTML = $('#summernote_1').code(); // get code
        //$('#summernote_1').destroy(); // destroy
    }

    return {
        //main function to initiate the module
        init: function () {
            handleWysihtml5();
            handleSummernote();
        }
    };

}();