<?php 

if(isset($_GET['createNote'])){
    $ab = new adatbazis();
    $ab->save();
}

if(isset($_GET['delete'])){
    $ab = new adatbazis();
    $ab->delete();
}

if(isset($_GET['deleteTag'])){
    $ab = new adatbazis();
    $ab->deleteTag();
}

if(isset($_GET['tag'])){
    $ab = new adatbazis();
    $ab->saveTag();
}

if(isset($_POST['update']))
{
  if (isset($_POST['id']) && is_numeric($_POST['id'])
  && isset($_POST['team']) && is_numeric($_POST['team'])
  && isset($_POST['status']) && is_numeric($_POST['status'])
  && isset($_POST['content']) && !empty($_POST['content']))
  {
    $ab = new adatbazis();
    $ab->update();
  }
}

if(isset($_GET['updateTag']))
{
  if (isset($_GET['id']) && is_numeric($_GET['id'])
  && isset($_GET['name']) && !empty($_GET['name']))
  {
    $ab = new adatbazis();
    $ab->updateTag();
  }
    
}

if(isset($_GET['load'])){
    $ab = new adatbazis();
    $ab->load();
}

  class adatbazis
  {
    public $servername = "localhost";
    public $username = "root";
    public $password = "";
    public $dbname = "notebook";
    public $conn = NULL;
    public $sql = NULL;
    public $result = NULL;
    public $row = NULL;
    function __construct()
    {
      $this->conn = mysqli_connect('localhost', 'root', '', 'notebook');
      if (!$this->conn) {
      die('Connection failed ' . mysqli_error($this->conn));
      }
    }

    function __destruct(){
      $this->conn->close();
    }

    public function load()
  {
    $list = "";
    if (isset($_GET['load']))
    {
      $this->sql = "SELECT name, id FROM team WHERE 1 ORDER BY 1 ASC";
      $result = mysqli_query($this->conn, $this->sql);
      while ($row = mysqli_fetch_array($result))
      {
        //$list += "[".$row['name'].",".$row['id']."]";
        $list = $list.$row['name']."-".$row['id']."-";
      }
    }
    $list = substr($list,0,strlen($list)-1);
    echo $list;
    exit();
  }

  function save()
  {
    if (isset($_GET['createNote']))
    {
      $t = $_GET['team'];
      $c = $_GET['content'];
      $s = $_GET['status'];
      $this->sql = "INSERT INTO note(content, team_id, status) VALUES ({$c}, {$t}, {$s})";
      if (mysqli_query($this->conn, $this->sql)){ echo mysqli_insert_id($this->conn); }
      else{ echo 0; }
      exit();
    }
  }

    function saveTag()
  {
    if (isset($_GET['tag']))
    {
      $name = $_GET['name'];
      $this->sql = "INSERT INTO team(name) VALUES ({$name})";
      if (mysqli_query($this->conn, $this->sql)){ echo mysqli_insert_id($this->conn); }
      else{ echo 0; }
      exit();
    }
  }
  // delete comment fromd database
  function delete()
  {
    if (isset($_GET['delete']))
    {
      $id = $_GET['id'];
      $this->sql = "DELETE FROM note WHERE id=" . $id;
      mysqli_query($this->conn, $this->sql);
      exit();
    }
  }

  function deleteTag()
  {
    if (isset($_GET['deleteTag']))
    {
      $id = $_GET['id'];
      $this->sql = "DELETE FROM team WHERE id=" . $id;
      if($this->result = mysqli_query($this->conn, $this->sql)) {echo 1;}
      else {echo 0;}
      exit();
    }
  }

  function update()
  {
    if(isset($_POST['update']))
    {
      $n = $_POST['id'];
      $t = $_POST['team'];
      $s = $_POST['status'];
      $c = $_POST['content'];
      var_dump($n);
      $this->sql = "UPDATE note SET content=".$c.",team_id=".$t.",status=".$s." WHERE id =".$n;
      mysqli_query($this->conn, $this->sql);
      exit();
    }
  }

  function updateTag()
  {
    if(isset($_GET['updateTag']))
    {
      $i = $_GET['id'];
      $n = $_GET['name'];
      $this->sql = "UPDATE team SET name={$n} WHERE id ={$i}";
      if (mysqli_query($this->conn, $this->sql)) {echo 1;}
      else { echo 0; }
      exit();
    }
  }

  // Retrieve comments from database
  public function list()
  {
    $this->sql = "SELECT note.id, note.content, team.name, note.status FROM note JOIN team ON note.team_id = team.id";
    $result = mysqli_query($this->conn, $this->sql);
    while ($row = mysqli_fetch_array($result))
    {
      echo '<article data-id="'.$row['id'].'">';
      echo '<div class="link"><a href="#" data-status="'.$row['status'].'" class="team">'.$row['name'].'</a></div>';
      echo '<div class="note">'.$row['content'].'</div>';
      echo '<div class="task">';
      echo '<span class="update">update</span>';
      echo '<span class="delete">delete</span>';
      echo '</div>';
      echo '</article>';
    }
  }
}
?>