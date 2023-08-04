<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Notes | Main</title>
  <link href="bootstrap.css" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header>
    <h1>NoteBook</h1>
    <p>100 elem</p>
  </header>
  <main class="container-fluid">
    <div class="row">
      <section class="col-md-8">
        <?php $ab = new adatbazis();
        $ab->listazz(); ?>
        <article>
          <div class="link"><a href="#" data-status="0" class="team">Art</a></div>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
          quis nostrud exercitation <span class="marker">ullamco</span> laboris nisi ut aliquip ex ea commodo
          consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
          cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
          proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          <div class="task"><span data-prompt="middle">update</span><span data-prompt="top">delete</span></div>
        </article>
        <article>
          <div class="link"><a href="#" data-status="1" class="team">Art</a></div>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
          quis nostrud exercitation <span class="marker">ullamco</span> laboris nisi ut aliquip ex ea commodo
          consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
          cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
          proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          <div class="task"><span data-prompt="middle">update</span><span data-prompt="top">delete</span></div>
        </article>
      </section>
      <section class="col-md-4"></section>
    </div>
  </main>
              <form class="comment_form">
                <div>
                  <label for="name">Szerző:</label>
                  <input type="text" name="name" id="name">
                </div>
                <div>
                  <label for="comment">Cím:</label>
                  <textarea name="comment" cols="30" rows="5" id="comment"></textarea>
                </div>
                <div>
                  <label for="comment">Kedvenc:</label>
                  <input type="checkbox" name="kedvenc" id="kedvenc"></input>
                </div>
                <div>
                  <label for="datum">Megjelenés dátuma:</label>
                  <input type="date" name="datum" id="datum"></input>
                </div>
                <button type="button" id="submit_btn">POST</button>
                <button type="button" id="update_btn" style="display: none;">UPDATE</button>
              </form>
        </div>
      </div>
    </div>
</body>
</html>
<!-- Add JQuery -->
<script src="jquery.min.js"></script>
<script src="script.js"></script>