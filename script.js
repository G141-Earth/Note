var n = null;
var c = null;
var s = null;
var options = null;
var backup = null;
var clickable = true;

function back()
{
  if (backup != null)
  {
    $('#form').remove();
    $('#preview').children('.task').removeAttr('disabled');
    $('#preview').children('.link').children().text(backup[0]);
    $('#preview').children('.note').html(backup[1]);
    $('#preview').children('.link').children().attr('data-status', backup[2]);
    $('#preview').removeAttr('id');
    backup = null;
  }
}

function linSearch(s, e, element)
{
  if (!(s < options.length && s >= 0 && e < options.length && s >= 0 && s <= e)) { return -1; }
  else if (s == e) { return sorting(element, options[e]) == 0 ? e : -1; }
  else
  {
    var piv = Math.round((s+e)/2);
    switch(sorting(element, options[piv]))
    {
      case 0:
        return piv;
        break;
      case 1:
        return linSearch(piv+1, e, element);
        break;
      case -1:
        return linSearch(s, piv-1, element);
        break;
    }
  }

}

//x.sort(sorting);
function sorting(a, b)
{
  if (a.name.toString() < b.name.toString()) { return -1; }
  else if (a.name.toString() > b.name.toString()) { return 1; }
  else { return 0; }
}

function statSetter()
{
  $('#red').attr("disabled", !(s == $('#red').data('status')));
  $('#yellow').attr("disabled", !(s == $('#yellow').data('status')));
  $('#green').attr("disabled", !(s == $('#green').data('status')));
  $('#status').val(s);
}

function panelTools(allow)
{
  $("#panel").append("<div class='task button' id='note'><span>Make new note</span></div>");
  $("#panel").append("<div class='task button' id='tag'><span>Make new tag</span></div>");
  $("#panel").append("<ul class='list'><li><span>tags</span><ul></ul></li></ul>");
  if (allow)
  {
    var tagContainer = $("#panel").children(".list").children("li").children("ul");
    for (var i = 0; i < options.length; i++)
    {
      tagContainer.append("<li class='tag' data-id='"+options[i].id+"'><span>"+options[i].name+"</span><div class='del'></div></li>");

    }
  }
}

function form(obj, create, method)
{
  method = method ? "POST" : "GET";
  create = create ? "<span data-prompt='bottom' id='create'>create</span>" : "<span data-prompt='bottom' id='update'>update</span>"
  obj.after("<form id='form' method='"+method+"'><div class='link'><div class='playground'><input type='hidden' name='status' id='status'><div id='red' data-status='0'></div><div id='yellow' data-status='1'></div><div id='green' data-status='2'></div></div></div><div><select name='team' id='team'></select></div><div><textarea name='content' id='content' rows='12'></textarea></div><div class='task'>"+create+"<span data-prompt='middle' id='close'>cancel</span></div></form>");
  statSetter();
  if (options != null)
  {
    for (var i = 0; i < options.length; i++)
    {
      $('#team').append("<option "+(options[i].name == n ? "selected" : "")+" value='"+options[i].id+"'>"+options[i].name+"</option>");
    }
    $('#content').val(c);
  }
}

$(document).ready(function()
  {
    $.ajax({
      url: 'server.php',
      type: 'GET',
      data: {
        'load': 1,
      },
      success: function(response){
        if (response != "")
        {
          response = response.split('-');
          options = [];
          for (var i = 0; i < response.length; i+=2)
          {
            options.push({name:response[i], id:response[i+1]});
          }
          panelTools(true);
        }
        else { panelTools(false); }
        //$("#panel").children(".list").children("li").children("ul").empty();
      }
    });

  $(document).on('click', '.delete', function(){
    if (clickable)
    {
      if (confirm("Do you want to delete this note?"))
      {
        clickable = false;
        var item = $(this).parent().parent();
        var id = item.data('id');
        $.ajax({
          url: 'server.php',
          type: 'GET',
          data: {
          'delete': 1,
          'id': id,
          },
          success: function(response){
            item.remove();
            clickable = true;
          }
        });
      }
    }
    
  });

  $(document).on('click', '.update', function(){
    if (clickable)
    {
      clickable = false;
      back();
      $(this).parent().parent().attr('id', 'preview');
      //$edit_comment = $(this).parent();
      // grab the comment to be editted
      var name = $('#preview').children('.link').children();
      var content = $('#preview').children('.note');
      var status = $('#preview').children('.link').children();
      n = name.text();
      c = content.html();
      s = status.data('status');
      backup = [n, c, s];

      $(this).parent().attr("disabled", true);
      form($('#preview'), false, true);
    }

  });
  $(document).on('click', '#red, #yellow, #green', function(){
    if (!clickable)
    {
      s = $(this).data('status');
      $(this).siblings('input').val(s);
      $('#preview').children('.link').children().attr('data-status', s);
      statSetter();
    }
  });

  $(document).on('keyup', '#content', function(){
    c = $(this).val();
    $('#preview').children('.note').html(c);
  });

  $(document).on('click', '#close', function(){
    if (!clickable)
    {
      clickable = true;
      if (backup == null)
      {
        $("#form").remove();
        $("#preview").remove();
      }
      back();
      backup = null;
      n = null;
      c = null;
      s = null;
    }
  });

  $(document).on('change', '#team', function(){
    n = $(this).children(':selected').text();
    $('#preview').children('.link').children().text(n);
  });

  $(document).on('click', '#note', function(){
    if (clickable)
    {
      if (options == null)
      {
        alert("You can not create note without tag!");
      }
      else
      {
        clickable = false;
        s = 0;
        c = "";
        n = options[0].name;
        $("h2").after('<article id="preview"><div class="link"><a href="#" data-status="0" class="team">'+n+'</a></div><div class="note"></div><div class="task" disabled="disabled"><span class="update">update</span><span class="delete">delete</span></div></article>');
        form($("#preview"),true, false);
      }
    }
  });

  $(document).on('click', '#update', function(){
    if (!clickable)
    {
      var name = $('#team').children(':selected').val();
      var content = $('#content').val();
      var status = $('#status').val();
      var id = $('#preview').data('id');
      
      $.ajax({
        url: 'server.php',
        type: 'POST',
        data: {
          'update': 1,
          'id': id,
          'team': name,
          'status': status,
          'content': "'"+content+"'",
        },
        success: function(response){
          $('#form').remove();
          $('#preview').children('.task').removeAttr('disabled');
          $('#preview').removeAttr('id');
          backup = null;
          n = null;
          c = null;
          s = null;
          clickable = true;
        },
      });
    }
  });

  $(document).on('click', '#create', function(){
    if (!clickable)
    {
      var name = $('#team').children(':selected').val();
      var content = $('#content').val();
      var status = $('#status').val();
      
      $.ajax({
        url: 'server.php',
        type: 'GET',
        data: {
          'createNote': 1,
          'team': name,
          'status': status,
          'content': ("'"+content+"'"),
        },
        success: function(response){
          if (response > 0)
          {
            $('#preview').children('.task').removeAttr('disabled');
            $('#form').after('<article data-id='+response+'>'+$("#preview").html()+'</article>');
          }
          $('#form').remove();
          $('#preview').remove();
          backup = null;
          n = null;
          c = null;
          s = null;
          clickable = true;
        },
      });
    }
  });

    $(document).on('click', '.tag span', function()
    {
      if(clickable)
      {
        var item = $(this).parent();
        var tag = prompt("Please enter a new word as tag:", name);
        if (!(tag == null || tag == "" || tag.split(" ").length != 1))
        {
          var name = $(this).text();
          tag = tag.toLowerCase();
          var id = item.data("id");
          $.ajax(
          {
            url: 'server.php',
            type: 'GET',
            data: {
            'updateTag': 1,
            'name':  ("'"+tag+"'"),
            'id': id,
            },
            success: function(response)
            {
              if (response > 0)
              {
                var done = false;
                var index = linSearch(0, options.length-1, {name: item.children("span").text(), id: id});
                options[index] = {name: tag, id: id};
                options.sort(sorting);
                item.remove();
                $("#panel").children(".list").children("li").children("ul").children().each(function(index)
                  {
                    done = $(this).text() != options[index].name;
                    if (done)
                    {
                      $(this).before("<li class='tag' data-id='"+options[index].id+"'><span>"+options[index].name+"</span><div class='del'></div></li>");
                      return false;
                    }
                  });
                if (!done)
                {
                  index = options.length-1;
                  $("#panel").children(".list").children("li").children("ul").append("<li class='tag' data-id='"+options[index].id+"'><span>"+options[index].name+"</span><div class='del'></div></li>");
                }
                $("article").each(function()
                {
                  if ($(this).children(".link").children().text() == name) { $(this).children(".link").children().text(tag); }
                });
            }
          }
        });
        }
      }
    });

  $(document).on('click', '.del', function(){
    if (clickable)
    {
      if (confirm("Do you want to delete "+$(this).siblings("span").text()+" tag?"))
      {
        clickable = false;
        var item = $(this).parent();
        var id =  item.data("id");
        $.ajax({
          url: 'server.php',
          type: 'GET',
          data: {
          'deleteTag': 1,
          'id': id,
          },
          success: function(response)
          {
            if (response > 0)
            {
              options = options.filter(t => t.id != id);
              if (options.length == 0) { options = null; }
              item.remove();
            }
            clickable = true;
          }
        });
      }
    }
  });

  $(document).on('click', '#tag', function(){
    if (clickable)
    {
      var tag = prompt("Please enter one word as tag:");
      if (!(tag == null || tag == "" || tag.split(" ").length != 1))
      {
        tag = tag.toLowerCase();
        $.ajax(
        {
          url: 'server.php',
          type: 'GET',
          data: {
          'tag': 1,
          'name':  ("'"+tag+"'"),
          },
          success: function(response)
          {
            if (response > 0)
            {
              if (options == null)
              {
                options = [{name:tag, id:response}];
                $("#panel").children(".list").children("li").children("ul").append("<li class='tag' data-id='"+options[0].id+"'><span>"+options[0].name+"</span><div class='del'></div></li>");
              }
              else
              {
                options.push({name:tag, id:response});
                options.sort(sorting);
                $("#panel").children(".list").children("li").children("ul").children().each(function(index)
                {
                  if ( $(this).text() != options[index].name )
                  {
                    $(this).before("<li class='tag' data-id='"+options[index].id+"'><span>"+options[index].name+"</span><div class='del'></div></li>");
                    return false;
                  }
                });
              }
            }
            else { alert("Tag already exist."); }
          }
        });
      }
      else if(tag != null) { alert("Nothing happend."); }
      clickable = true;
    }
  });
});