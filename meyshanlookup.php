<?php
/*
Plugin Name: LiveWords
Description: Allows users to look up words and phrases from your blog on-the-fly.
Author: P. Dayaparan 
Version: 1.2
Plugin URI: http://www.spicyexpress.net
Author URI: http://www.spicyexpress.net/
*/

$meyshanlookup_linkback = 'http://www.spicyexpress.net';

function meyshanlookup_head() {
   ?>
<script type="text/javascript" src="<?php echo get_bloginfo('wpurl'); ?>/wp-content/plugins/meyshanlookup/meyshanlookup.js"></script>
<script type="text/javascript" src="<?php echo get_bloginfo('wpurl'); ?>/wp-content/plugins/meyshanlookup/yui-ext.js"></script>
<script type="text/javascript">
   var meyshanlookup_url = '<?php echo get_bloginfo('wpurl'); ?>/wp-content/plugins/meyshanlookup/';
</script>
<link href="<?php echo get_bloginfo('wpurl'); ?>/wp-content/plugins/meyshanlookup/styles.css" type="text/css" rel="stylesheet" />
   <?php
}//end function meyshanlookup_head
add_action('wp_head', 'meyshanlookup_head');

	// This is the function that outputs the form to let the users edit
	// the widget's title. It's an optional feature that users cry for.
	function widget_meyshanlookup_control($rtrn=false) {

		// Get our options and see if we're handling a form submission.
		$options = get_option('widget_meyshanlookup');
		if ( !is_array($options) )
			$options = array('badge-pos' => 'footer', 'badge-size' => '173');
		if ( $_POST['meyshanlookup-submit'] ) {

			// Remember to sanitize and format use input appropriately.
//			$options['title'] = strip_tags(stripslashes($_POST['meyshanlookup-title']));
			$options['badge-pos'] = strip_tags(stripslashes($_POST['meyshanlookup-badge-pos']));
			$options['badge-size'] = strip_tags(stripslashes($_POST['meyshanlookup-badge-size']));
			update_option('widget_meyshanlookup', $options);
                        echo '<b style="display:block;text-align:center;">Settings saved!</b>';
		}

		// Be sure you format your options to be valid HTML attributes.
//		$title = htmlspecialchars($options['title'], ENT_QUOTES);
		
		// Here is our little form segment. Notice that we don't need a
		// complete form. This will be embedded into the existing form.
                $txt = '';
//		$txt .= '<p style="text-align:right;"><label for="meyshanlookup-title">' . __('Title:') . '</label> <input style="width: 200px;" id="meyshanlookup-title" name="meyshanlookup-title" type="text" value="'.$title.'" /></p>';
		$txt .= '<p style="text-align:right;"><label for="meyshanlookup-badge-pos">' . __('Badge Position:') . '</label> <select name="meyshanlookup-badge-pos"><option value="footer"'.($options['badge-pos'] == 'footer' ? ' selected="selected"' : '').'>Footer</option> <option value="header"'.($options['badge-pos'] == 'header' ? ' selected="selected"' : '').'>Header</option> <option value="widget"'.($options['badge-pos'] == 'widget' ? ' selected="selected"' : '').'>Sidebar (as widget)</option></select></p>';
		$txt .= '<p style="text-align:right;"><label for="meyshanlookup-badge-size">' . __('Badge Width:') . '</label> <select name="meyshanlookup-badge-size"><option value="143"'.($options['badge-size'] == '143' ? ' selected="selected"' : '').'>143 pixels</option> <option value="173"'.($options['badge-size'] == '173' ? ' selected="selected"' : '').'>173 pixels</option> <option value="286"'.($options['badge-size'] == '286' ? ' selected="selected"' : '').'>286 pixels</option></select></p>';
		$txt .= '<input type="hidden" id="meyshanlookup-submit" name="meyshanlookup-submit" value="1" />';
                if(!$rtrn) echo $txt;
                else return $txt;
	}

function meyshanlookup_page() {
   $txt = widget_meyshanlookup_control(true);
   echo '<form method="post" style="width:300px;margin:0 auto;">';
   echo $txt;
   echo '<p style="text-align:right;"><input type="submit" value="Save" /></p>';
   echo '</form>';
}//end function meyshanlookup_page

function meyshanlookup_tab($s) {
   add_submenu_page('options-general.php', 'LiveWords', 'LiveWords', 1, __FILE__, 'meyshanlookup_page');
   return $s;
}//end function meyshanlookup_tab
add_action('admin_menu', 'meyshanlookup_tab');

   $meyshanlookup_badge_rendered = false;
	// This is the function that outputs our little Google search form.
	function widget_meyshanlookup($args) {

                global $meyshanlookup_linkback;
                global $meyshanlookup_badge_rendered;
                if($meyshanlookup_badge_rendered) return;
                $meyshanlookup_badge_rendered = true;
		
		// $args is an array of strings that help widgets to conform to
		// the active theme: before_widget, before_title, after_widget,
		// and after_title are the array keys. Default tags: li and h2.
                if($args) extract($args);

		// Each widget can store its own options. We keep strings here.
		$options = get_option('widget_meyshanlookup');

		// These lines generate our output. Widgets can be very complex
		// but as you can see here, they can also be very, very simple.
		$txt = $before_widget;
                $txt .= '<a href="'.htmlentities($meyshanlookup_linkback).'"><img src="'.htmlentities(get_bloginfo('wpurl')).'/wp-content/plugins/meyshanlookup/livewords_'.$options['badge-size'].'.gif" alt="Power by LiveWords" /></a>';
		$txt .= $after_widget;
                
                if($options['badge-pos'] == 'header') {//move to head
                   echo '<div style="position:absolute;top:10px;right:10px;z-index:1000;">'.$txt.'</div>';
                } else {//else default to footer
                   echo $txt;
                }//end if-else header
	}
add_action('wp_footer', 'widget_meyshanlookup');

// Put functions into one big function we'll call at the plugins_loaded
// action. This ensures that all required plugin functions are defined.
function widget_meyshanlookup_init() {

	// Check for the required plugin functions. This will prevent fatal
	// errors occurring when you deactivate the dynamic-sidebar plugin.
	if ( !function_exists('register_sidebar_widget') )
		return;

	// This registers our widget so it appears with the other available
	// widgets and can be dragged and dropped into any active sidebars.
	register_sidebar_widget(array('Meyshan Lookup', 'widgets'), 'widget_meyshanlookup');

	// This registers our optional widget control form. Because of this
	// our widget will have a button that reveals a 300x100 pixel form.
//	register_widget_control(array('Meyshan Lookup', 'widgets'), 'widget_meyshanlookup_control', 300, 100);
}

// Run our code later in case this loads prior to any required plugins.
add_action('widgets_init', 'widget_meyshanlookup_init');

?>