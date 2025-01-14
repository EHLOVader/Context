//open "new context" dialog
function openNewContextDialog() {
	var buttons = {};
	buttons[chrome.i18n.getMessage("create")] = function() {
				clearDialogErrors($(this));
				$(this).find('input, ul').removeClass("ui-state-error");



				var isValid = true;

				var contextName = $('#context-name').val();
				if(contextName.length == 0) {
					$('#context-name').addClass("ui-state-error");
					isValid = false;
					addDialogError($(this), chrome.i18n.getMessage("name_field_is_required"));
				}


				var contexts = $('.contextExtensions');
				for(var i=0; i<contexts.length; i++) {
					var context = contexts[i];
					if($(context).data('contextName') == contextName) {
						$('#context-name').addClass("ui-state-error");
						isValid = false;
						addDialogError($(this), chrome.i18n.getMessage("this_name_is_already_in_use"));
						break;
					}
				}

				var contextFaIcon = $('#context-fa-icon').val();
				if(contextFaIcon.length == 0) {
					var selectedIcon = $('#context-icons li.ui-selected img');
				}else{
					var selectedIcon = 'icons/fa/' + contextFaIcon + '.svg';
				}

				if(selectedIcon.length == 0) {
					$('#context-icons').addClass("ui-state-error");
					isValid = false;
					addDialogError($(this), chrome.i18n.getMessage("pick_an_icon"));
				}
				
				var showIcon = $("#showExtensionIcon").is(':checked') ? 'show_extension' : 'show_context';

				if(contextFaIcon.length == 0) {
					selectedIcon = selectedIcon.attr('src');
				}

				if ( isValid ) {
					var context = newContext(contextName, selectedIcon, showIcon);
					$('#contexts').append(context);
					context.effect('highlight', {}, 'slow');
					$( this ).dialog( "close" );
					markDirty();
				}
			};

	buttons[chrome.i18n.getMessage("cancel")] = function() {
		$( this ).dialog( "close" );
	};



	var faicons = $('#context-fa-icon').fontIconPicker({
		theme: 'flip-grey',
		iconGenerator: function( item ) {
			return '<img src="icons/fa/'+item+'.svg" alt="'+item+'" class="contextIcon"/>';
		},
		useAttribute: true,
		attributeName: 'data-icon',
		appendTo: $('body')
	});

	$.ajax( {
		url: 'icons/fa/icons.json',
		type: 'GET',
		dataType: 'json'
	} )
	.done( function( response ) {
		console.log( response );
		setTimeout( function() {
			// Reset icons
			faicons.setIcons(response);

		});
	} )
	.fail( function() {
		console.log( "error" );
	} );


	$( '#new-context-form' )
		.dialog( "option", "title", chrome.i18n.getMessage("create_new_context") )
		.dialog( "option", "buttons", buttons)
		.dialog( "open" );
}

//open "edit context" dialog
function openEditContextDialog(context) {
	var contextName = context.find('.contextExtensions').data('contextName');
	var contextImg = context.find('.contextExtensions').data('contextImg');
	if(contextImg.indexOf('icons/fa/') == 0) {
		contextImg = contextImg.substring(9, contextImg.length);
		contextImg = contextImg.substring(0, contextImg.length-4);
	}
	var contextIcon = context.find('.contextExtensions').data('contextIcon') || 'show_context';

	$( '#new-context-form' ).find('input[name=context-name]').val(contextName);
	$( '#new-context-form' ).find('img[src="'+contextImg+'"]').parent().addClass('ui-selected');
	$( '#new-context-form' ).find('input[name=context-fa-icon]').val(contextImg);
	$( '#new-context-form' ).find('#showExtensionIcon').prop('checked', (contextIcon === 'show_extension'));

	var buttons = {};
	buttons[chrome.i18n.getMessage("save")] = function() {
				clearDialogErrors($(this));
				$(this).find('input, ul').removeClass("ui-state-error");

				var isValid = true;

				var contextName = $('#context-name').val();
				if(contextName.length == 0) {
					$('#context-name').addClass("ui-state-error");
					isValid = false;
					addDialogError($(this), chrome.i18n.getMessage("name_field_is_required"));
				}

				var contexts = $('.contextExtensions');
				for(var i=0; i<contexts.length; i++) {
					var otherContext = contexts[i];
					if($(otherContext).closest('.context')[0] != context[0] && $(otherContext).data('contextName') == contextName) {
						$('#context-name').addClass("ui-state-error");
						isValid = false;
						addDialogError($(this), chrome.i18n.getMessage("this_name_is_already_in_use"));
						break;
					}
				}

				var contextFaIcon = $('#context-fa-icon').val();
				if(contextFaIcon.length == 0) {
					var selectedIcon = $('#context-icons li.ui-selected img');
				}else{
					var selectedIcon = 'icons/fa/' + contextFaIcon + '.svg';
				}

				if(selectedIcon.length == 0) {
					$('#context-icons').addClass("ui-state-error");
					isValid = false;
					addDialogError($(this), chrome.i18n.getMessage("pick_an_icon"));
				}

				var showIcon = $("#showExtensionIcon").is(':checked') ? 'show_extension' : 'show_context';

				if(contextFaIcon.length == 0) {
					selectedIcon = selectedIcon.attr('src');
				}

				if ( isValid ) {
					context.find('.contextExtensions').data('contextName', contextName);
					context.find('.contextExtensions').data('contextImg', selectedIcon);
					context.find('.contextExtensions').data('contextIcon', showIcon);

					context.find('.contextTitle').text(contextName);
					context.find('.contextIcon').attr('src', 'icons/fa/' + contextFaIcon + '.svg');

					context.effect('highlight', {}, 'slow');

					$( this ).dialog( "close" );
					markDirty();
				}
			};

	buttons[chrome.i18n.getMessage("cancel")] = function() {
			$( this ).dialog( "close" );
		};


	var faicons = $('#context-fa-icon').fontIconPicker({
		theme: 'flip-grey',
		iconGenerator: function( item ) {
			return '<img src="icons/fa/'+item+'.svg" alt="'+item+'" class="contextIcon"/>';
		},
		useAttribute: true,
		attributeName: 'data-icon',
		appendTo: $('body')
	});

	$.ajax( {
		url: 'icons/fa/icons.json',
		type: 'GET',
		dataType: 'json'
	} )
		.done( function( response ) {
			console.log( response );
			setTimeout( function() {
				// Reset icons
				faicons.setIcons(response);

			});
		} )
		.fail( function() {
			console.log( "error" );
		} );

	$( '#new-context-form' )
		.dialog( "option", {
			title: chrome.i18n.getMessage("edit_context"),
			buttons: buttons,
			width: 370
		})
		.dialog( "open" );
}

//remove errors from edit/new context form
function clearDialogErrors(dialog) {
	$(dialog).find('.errors').empty().hide();
}

//append new context edit/new form error
function addDialogError(dialog, error) {
	var icon = $('<span />').attr('class', 'ui-icon ui-icon-info').attr('style', 'float: left; margin-right: .3em;');
	var p = $('<p />').append(icon).append(error);
	$(dialog).find('.errors').append(p).show();
}

//init basic dialog for editing / adding new contexts
function initNewContextDialog() {
	var icons = CONFIG.get("icons");
	for(var index in icons) {
		var iconName = icons[index];
		var iconImg = $('<img/>').attr('src', CONFIG.get("iconsPath") + iconName + '.png').attr('alt', iconName);
		var iconBox = $('<li/>').addClass('ui-widget-content').addClass('ui-corner-all').append(iconImg);

		$( "#context-icons" ).append(iconBox);
	}

	//selectable icons
	$( "#context-icons li" ).click(function() {
		$(this).addClass("ui-selected").siblings().removeClass("ui-selected");
	});

	$( "#new-context-form" ).dialog({
		autoOpen: false,
		resizable: false,
		width: 370,
		modal: true,
		close: function() {
			clearDialogErrors($(this));
			$(this).find('.ui-selected').removeClass("ui-selected");
			$(this).find('input:text').val( "" ).removeClass("ui-state-error");
			$(this).find('ul').removeClass( "ui-state-error" );
			$(this).find('#showExtensionIcon').prop('checked', false);
		}
	}).find('form').submit(function(){
		return false;
	});
}

function showErrorDialog(config) {
	var buttons = {};
	buttons[chrome.i18n.getMessage("close")] = function() {
		$( this ).dialog( "close" );
	};

	$( "#dialog-confirm" ).dialog({
		title: config.title,
		resizable: false,
		height: 200,
		modal: true,
		buttons: buttons
	}).find('span.dialog-content').text(config.content);
}

function importSuccessDialog(config) {
	var dialogElem = $( "#dialog-import-success" );
	var dialogHeight = 200;
	var buttons = {};
	buttons[chrome.i18n.getMessage("close")] = function() {
		$( this ).dialog( "close" );

		if(typeof config.callback == "function") {
			config.callback();
		}
	};

	if(config.missingExtensions.length > 0) {
		dialogElem.find('p:eq(1), ul').show();
		var extensionsList = dialogElem.find('ul');
		extensionsList.empty();

		$.each(config.missingExtensions, function(i, item){
			var extensionLink = $('<a>').text(item.name).attr('href', 'https://chrome.google.com/webstore/detail/' + item.id).attr('target', '_blank');

			extensionsList.append($('<li>').append(extensionLink));
		});

		dialogHeight = 'auto';
	} else {
		dialogElem.find('p:eq(1), ul').hide();
	}

	$( "#dialog-import-success" ).dialog({
		title: chrome.i18n.getMessage("successful_import"),
		resizable: false,
		height: dialogHeight,
		modal: true,
		buttons: buttons
	});
}
