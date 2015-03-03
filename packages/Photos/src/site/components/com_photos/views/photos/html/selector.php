<?php defined('KOOWA') or die('Restricted access'); ?>

<h4><?= @text('COM-PHOTOS-SELECTOR-TITLE') ?></h4>

<?= @message(@text('COM-PHOTOS-SELECTOR-INSTRUCTIONS')) ?>

<?php if(!empty($exclude_set)): ?>
<div class="form-actions">
	<a data-trigger="ClosePhotoSelector" href="#" class="btn"><?= @text('LIB-AN-ACTION-CANCEL') ?></a> 
	<a data-trigger="UpdateSet" href="<?= @route() ?>" class="btn btn-primary"><?= @text('LIB-AN-ACTION-SAVE') ?></a>
</div>
<?php endif; ?>

<?php
$url = array('view'=>'photos', 'layout'=>'selector_list', 'oid'=>$actor->id);

if(!empty($exclude_set))
	$url['exclude_set'] = $exclude_set;
?>
<div class="an-entities media-grid" data-trigger="InfiniteScroll" data-url="<?= @route($url) ?>">
<?= @template('selector_list') ?>	
</div>