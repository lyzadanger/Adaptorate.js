<?php
/**
 * @file
 * 
 *
 */
if ($_GET['element_id']) {
  header('content-type:text/html');
  print '<p>This content was retrieved via AJAX: "' . $_GET['element_id'] . '"</p>';
}