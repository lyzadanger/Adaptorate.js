<?php
/**
 * @file
 * 
 *
 */
if ($_GET['element_id']) {
  header('content-type:text/html');
  print '<p>You have requested element "' . $_GET['element_id'] . '"</p>';
}