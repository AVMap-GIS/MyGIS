/**
	Methods and classes for the user back-end of MyGIS
	@class mygis.User
	@static
**/
mygis.User = {

	/**
		Functions that are meant to be overrided by app-specific functionality
		@class mygis.User.Hooks
		@static
	**/
	Hooks: {
		
		/**
			Fired after initial load, when the user is logged in
			@method initialLoad
		**/
		initialLoad: function(){},
		
		/**
		* @method beforeProfileUpdate
		*/
		beforeProfileUpdate: function(){},
		
		/**
		* @method afterProfileUpdate
		*/
		afterProfileUpdate: function(){},
		
		/**
		* @method getProfilePageData
		*/
		getProfilePageData: function(){return null;},
		
		/**
		* @property updateProfileUrl
		*/
		updateProfileURL: config.mgreq+"?qtype=updateUserProfile",
		
		/**
		* @property getAppUsersURL
		*/
		getAppUsersURL: config.mgreq+"?qtype=GetAppUserList&qContents=",
		
		getUserGridColumnSource: function(url){
			var source = {
				datatype: "json",
				datafields: [
					{ name: "userID" },
					{ name: "username" },
					{ name: "firstName" },
					{ name: "lastName" },
					{ name: "email" }, 
					{ name: "isSelected", type: "boolean"}
				],
				id: 'adminUserList',
				url: url
			};
			return source;
		},
		
		getUserGridColumns: function(){
			var columns = [
				{text: '', datafield: 'isSelected', width: 20, columntype: 'checkbox'},
				{text: strings.UserManager.col_userLastname, datafield: 'lastName', editable:false},
				{text: strings.UserManager.col_userFirstname, datafield: 'firstName',editable:false},
				{text: strings.UserManager.col_userName, datafield: 'username',editable:false},
				{text: strings.UserManager.col_userEmail, datafield: 'email',editable:false},
				{text: strings.UserManager.col_userID, datafield: 'userID', editable:false}
			];
			return columns;
		},
		
		/**
		* @method loadUserLayerRights
		*/
		loadUserLayerRights: function(){
			var url=config.mgreq+"?qtype=getUserLayerRights";
			var data={
				layers:[]
			}
			$.each(layerSource.records,function(x,item){
				data.layers.push(item.layerID);
			});
			$.ajax({
				type:"POST",
				data: JSON.stringify(data),
				url: url,
				success: function(retdata){
					var results=eval(retdata);
					internalMemory.layerRights={};
					$.each(results,function(i,result){
						var newObj={
							objectID: result.objectID,
							hasUpdate: result.hasUpdate,
							hasDelete: result.hasDelete,
							isOwner: result.isOwner
						}
						if (!internalMemory.layerRights[result.layerID]){
							internalMemory.layerRights[result.layerID]=[];
						}
						internalMemory.layerRights[result.layerID].push(newObj);
					});
					
				}
			});
		},
		
		AdminTabActions: function(menuItem,defaultContent){},
		
		UserManager: {
			afterSingleCheckClicked: function(elem){},
			afterUserSelected: function(){},
			afterUserUnselected: function(){},
			beforeUserDelete: function(){return true;},
			afterUserDelete: function(){},
			getUserDeleteURL: function(){return config.mgreq+"?qtype=deleteUsers";}
		}
		
	},
  
	/**
		Functions related to the user profile data
		@class mygis.User.ProfileInfo
		@static
	**/
	ProfileInfo: {
	
		/**
		 * Gets the profile details
		 * @method getProfileDetails
		 */
		getProfileDetails: function(){
			var customUrl = config.mgreq+"?qtype=GetCurrentUserDetails";
			mygis.Utilities.blockUI();
			$.ajax({
				type:"GET",
				url: customUrl,
				success: function(data){
					mygis.Utilities.unblockUI();
					try{
						var realResults = eval(data);
						mygis.User.ProfileInfo.buildCategories(realResults);
						
					}catch(err){
						displayError("There was an error in the request.");
						console.log(err.message);
					}
				}
			});
			
		},
		
		/**
		 * Re-arranges the raw properties according to to their categories
		 * @method categorizeProperties
		 * @param {Array} rawData
		 * @returns {Object} An object containing the categories. Each category is an array of properties.
		 */
		categorizeProperties: function(rawData){
			var retvalue = {};
			$.each(rawData,function(key,obj){
				if (!retvalue[obj.PropertyCategory]){
					retvalue[obj.PropertyCategory]=[];
				}
				retvalue[obj.PropertyCategory].push(obj);
			});
			return retvalue;
		},
		
		/**
		* Updates the dnn profile
		* @method updateProfile
		*/
		updateProfile: function(){
			mygis.User.Hooks.beforeProfileUpdate();
			var data = mygis.User.Hooks.getProfilePageData();
			if (!data){
				//TODO: get proper (non-application specific) profile data
			}
			mygis.Utilities.blockUI();
			$.ajax({
				type:"POST",
				data: {"qContents": JSON.stringify(data)},
				url: mygis.User.Hooks.updateProfileURL,
				success: function(data){
					mygis.Utilities.unblockUI();
					var realResults = eval(data);
					if (realResults.iotype=="success"){
						displaySuccess(strings.UserProfile.updateSuccess);
					}else{
						displayError(realResults.iomsg);
					}
					mygis.User.Hooks.afterProfileUpdate();
				}
			});
			
		},
		/**
		 * This function dynamically builds the category tabs, based on the actual data.
		 * @method buildCategories
		 * @param {Array} rawData
		 * @example
		 * Example output:
		 * <div id="profileInfo">
		 * 	<div class="sectionHeader">
		 * 		<a href="#">Tab 1</a>
		 * 	</div>
		 * 	<div class="sectionContent">
		 *		<div class="sectionButtons">
		 *			<a href="#" class="adminGenericAction"><span></span>New</a>
		 *		</div>
		 *		<div class="editAppRow">
		 *			...
		 *		</div>
		 * 	</div>
		 * </div>
		 */
		buildCategories: function(rawData){
			var finalData = mygis.User.ProfileInfo.categorizeProperties(rawData);
			var finalForm = $("<div />");
			finalForm.attr("id","profileInfoForm");
			var counter = 0;
			var first=true;
			$.each(finalData,function(key,prop){
				if (key!="Hidden"){
					var header = $("<div class='sectionHeader' />");
					var headerLink = $(mygis.Utilities.format("<a href='#' onclick='router(\"accountInfo_Config_Tab\",{0});' />",counter));
					headerLink.append(key);	//TODO: strings.UserProfile.Categories.key
					header.append(headerLink);
					var content = $("<div class='sectionContent' />");
					var sectionButtons= $("<div class='sectionButtons' />");
					content.append(sectionButtons);
					if (first){
						first=false;
						content.css("display","block");
					}
					$.each(prop,function(index,property){
						content.append(mygis.User.ProfileInfo.buildProfileEntry(
										property.DataType,
										property.PropertyName,
										property.PropertyValue,
										property.PropertyValue
										));
						//console.log(mygis.Utilities.format("{0}: {1}",property.PropertyName,mygis.User.ProfileInfo.decodeDNNDataType(property.DataType)));
					});
					
					finalForm.append(header);
					finalForm.append(content);
					counter+=1;
				}
			});
			$("#up_AccountTab_Info").empty();
			$("#up_AccountTab_Info").append(finalForm);
			mygis.User.UI.setTabs(finalForm.find(".sectionHeader").clone());
			router("amenu_Apps_Config_Tab",0);
		},
		
		/**
		* Builds a profile entry
		* @method buildProfileEntry
		* @param {String} entryType One of 'list','string','number'
		* @param {String} entryName The property's name
		* @param {Mixed} entryValues The possible values for the entry (if it is a list) or the actual value if it's not
		* @param {String} entrySelectedValue The selected value (if it is a list)
		*/
		buildProfileEntry: function(entryType,entryName,entryValues,entrySelectedValue){
			var retvalue = null;
			
			try{
				retvalue = $("<div class='editAppRow' />");
				
				var label = $("<span class='editAppLabel' />");
				var inp = $("<input class='editAppInput "+entryName.replace(" ","_")+"' type='text' />");
				label.append(entryName);
				inp.val(entrySelectedValue);
				retvalue.append(label);
				retvalue.append(inp);
			}catch(err){
				retvalue=null;
			}
			return retvalue;
		},
		
		switchToTab: function(event){
			var index = event.item;
			var tabHeaders = $("#up_contentLinkTabsRound").find(".sectionHeader");
			for (var i=0;i<tabHeaders.length;i++){
					if (i!=index){
							tabHeaders[i].ex_RemoveClassName("active");
					}else{
							tabHeaders[i].ex_AddClassName("active");
					}
			}
			var tabs = $("#profileInfoForm").find(".sectionContent");
			for (var i=0;i<tabs.length;i++){
					if (i!=index){
							$(tabs[i]).hide();
					}else{
							$(tabs[i]).show();
							var buttons = $(tabs[i]).find(".sectionButtons");
							$("#up_contentSpecificToolbar").empty();
							$("#up_contentSpecificToolbar").append(buttons.clone());
					}
			}
		},
		
		/**
		 * This decodes a dataTypeID to a more friendly string
		 * @method decodeDNNDataType
		 * @param {Integer} dataTypeID
		 * @returns {String} The friendly name
		 */
		decodeDNNDataType: function(dataTypeID){
			//This should come from the database, but for now...:
			var retvalue="";
			switch (dataTypeID){
				case 349:	//Text
					retvalue = "Text";
					break;
				case 352:	//Timezone
					retvalue = "Timezone";
					break;
				case 353:	//Locale
					retvalue = "Locale";
					break;
				case 355:	//Rich Text
					retvalue = "Rich Text";
					break;
				case 356:	//Country
					retvalue = "Country";
					break;
				case 357:	//Region
					retvalue = "Region";
					break;
				case 358:	//List
					retvalue = "List";
					break;
				case 361:	//Image
					retvalue = "Image";
					break;
				case 1414:	//TimeZoneInfo
					retvalue = "TimeZoneInfo";
					break;
				default:
					retvalue="Unknown datatype: "+dataTypeID;
					
			}
			return retvalue;
		}
	},
		
	/**
		UI-related functions
		@class mygis.User.UI
		@static
	**/
	UI: {
		
		/**
			Hides the admin interface and shows the application.
			@method switchToApp
		**/
		switchToApp: function(){
			$("#page_administration").hide();
			$("#page_userProfile").hide();
			$("#page_effect").show();
			$(window).resize();
		},
		
		/**
		 * Resets the tabs under each menu to blank status
		 * @method resetTabs
		 */
		resetTabs: function(){
			$("#up_contentLinkTabsRound").empty();
			$("#up_contentLinkTabs").css("display","none");
			$("#up_contentSpecificToolbar").empty();
		},
		
		setTabs: function(htmlElement){
			mygis.User.UI.resetTabs();
			$("#up_contentLinkTabsRound").append(htmlElement);
			$("#up_contentLinkTabs").css("display","table-row");
		},
	
		/**
			Handles the off-page loading of the userpage interface
			@method loadUserPage
		**/
		loadUserPage: function(){
			if ($("#page_userProfile").children().length==0){
				mygis.Utilities.blockUI();
				loadFragment("page_userProfile",mygis.User.UI.initialize);
			}else{
				mygis.User.UI.initialize();
			}
			
		},
			
		/**
			Initializes the interface (menus,tabs,grids, handlers etc)
			@method initialize
		**/
		initialize: function(){
			mygis.Utilities.unblockUI();
			internalConfig.isUserPageLoaded=true;
			$("#up_menuTabs").jqxMenu({ 
				width: '635', 
				height: '30', 
				mode: 'horizontal', 
				showTopLevelArrows: true, 
				theme: 'classic' 
			});
		 
			$("#up_menuTabs").bind('itemclick',function(event){
				MakeTimeout(mygis.User.UI.menuClick,event,800,this);
			});
			
		
			mygis.User.UI.switchToUserPage();
			mygis.User.UI.menuClick(null,"up_menuAccount_Info");	//TODO: first item
			router('accountInfo_Config_Tab',0);	
			
		},
			
		switchToUserPage: function(){
			if (internalConfig.isUserPageLoaded){
				$("#page_effect").hide();
				$("#page_administration").hide();
				$("#page_userProfile").show();
			}else{
				mygis.User.UI.loadUserPage();
			}
		},
		
		/**
			Handles the clicking of a menu item
			
			@method menuClick
			@param {Object} sender The menu object
			@param {String} manualID Used if called manually.
		**/
		menuClick: function(sender,manualID){
			var eventArgs = manualID?document.getElementById(manualID):sender.args;
			var callerID = eventArgs.id;
			var menuLevel=-1;
			if (manualID){sender = $("#up_menuTabs");}
			if (callerID){
				var idparts =callerID.split("_");
				menuLevel = idparts.length-1;
				var parent;
				var title;
				if (menuLevel>1){
					if (manualID){
						parent = $(sender).find(mygis.Utilities.format("#{0}_{1}",idparts[0],idparts[1]));
					}else{
						sender.currentTarget=this;
						parent = $(sender.currentTarget).find(mygis.Utilities.format("#{0}_{1}",idparts[0],idparts[1]));
					}
					
					title = parent.find("a").html();
				}
			}
			if (menuLevel>1){
				var idparts =callerID.split("_");
				switch (idparts[1]){
					case "menuAccount":
						
						break;
				}
				mygis.User.UI.resetTabs();
				switch(callerID){
					case "up_menuAccount_Info":
						mygis.User.UI.activateTab("up_AccountTab_Info");
						mygis.User.UI.createGenericActions(callerID);
						$("up_contentActionsTitle").attr("class","");
						mygis.User.ProfileInfo.getProfileDetails();
						break;
				}
			}
		},
		
		/**
			Activates(displays) the content tab with the given id and hides the rest.
			
			@method activateTab
			@param {String} tabID 
		**/
		activateTab: function(tabID){
			var tabs = $("#up_contentTabs").find(".contentTab");
			$.each(tabs,function(i,v){
				var myid = $(v).attr("id");
				if (myid==tabID){
					$(v).attr("class","contentTab active");
				}else{
					$(v).attr("class","contentTab");
				}
			});
		},
		
		/**
			Generates a button for the "generic actions"
			
			@method btnGenerator
			@param {String} id The generated id on the element
			@param {String} imageClass The additional class the element should have (in order to display an image)
			@param {String} text The text that will be displayed for the button
			@param {String} action A function that should be attached at the "onclick" event
			@param {Boolean} disabled If the button starts disabled.
			@return {Element} The generated element.
		**/
		btnGenerator: function(id,imageClass,text, action,disabled){
			var retvalue = $("<a />");
			retvalue.attr("href","#");
			retvalue.attr("id",id);
			retvalue.attr("title",text);
			if (disabled){
				retvalue.attr("class","adminGenericAction disabled");
			}else{
				retvalue.attr("class","adminGenericAction");
			}
			if (action){
				retvalue.attr("onclick",action);
			}
			var imgElement = $("<span />");
			imgElement.attr("class",mygis.Utilities.format("adminActionImg {0}",imageClass));
			
			retvalue.append(imgElement);
			retvalue.append(text);
			return retvalue;
		},
		
		/**
			Creates the generic action buttons for each menu item
			@method createGenericActions
			@param {String} menuItem The menuItem to create actions for
		**/
		createGenericActions: function(menuItem){
			var actionCount=0;
			var actionIDs=[];
			var actionTexts = [];
			var actionClasses = [];
			var actionHandlers = [];
			var disabled=[];
			var replacement=$("<div />");
			switch(menuItem){
				case "up_menuAccount_Info":
					actionCount = 2;
					actionIDs = [
						mygis.Utilities.format("{0}_{1}",menuItem,"save"),
						mygis.Utilities.format("{0}_{1}",menuItem,"cancel")
					];
					actionTexts = [
						 strings.AppManager.upmenu_ProfileInfo_Save,
						 strings.AppManager.upmenu_ProfileInfo_Cancel
					];
					actionClasses = ["imgSave", "imgCancel"];
					actionHandlers = [
						mygis.Utilities.format("router('{0}','{1}');return false;",menuItem,"save"),	//FIX
						mygis.Utilities.format("router('{0}','{1}');return false;",menuItem,"cancel")
					];
					disabled = [false];
					break;
			}
			for (var i=0;i<actionCount;i++){
				replacement.append(mygis.User.UI.btnGenerator(actionIDs[i],actionClasses[i],actionTexts[i],actionHandlers[i],disabled[i]));
			}
			if (actionCount>0){
				$("#up_contentToolbar").html(replacement.html());
			}
		}
	
	}
}