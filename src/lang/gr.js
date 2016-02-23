//Tool tips:
var tip_marker = "Σχεδίαση σημείου";
var tip_polyline = "Σχεδίαση γραμμής";
var tip_polygon = "Σχεδίαση πολυγώνου";
var tip_drive = "Σχεδίαση κατά μήκος δρόμου";
var tip_editmode = "Επεξεργασία σχεδίασης";
var tip_undo = "Αναίρεση τελευταίας ενέργειας";
var tip_trash = "Διαγραφή όλων";
var tip_btnErgaleia = "Εργαλεία";
var tip_btnAnazitisi = "Αναζήτηση";
var tip_btnLayers = "Επίπεδα";
var tip_btnMaps = "Διαθέσιμοι χάρτες";
var tip_btnTables = "Πίνακες";
var tip_btnSave = "Αποθήκευση χάρτη";

//Messages:
var msg_searchPrompt = "Εισάγετε διεύθυνση...";
var msg_errNoLicence = "Πρέπει να διαθέτετε άδεια για αυτή την ενέργεια!";
var msg_errAddressNotFound = " δε βρέθηκε";
var msg_errWrongKML = "Το KML που ζητήθηκε περιέχει λάθη";
var msg_errFeatureNotImplemented = "Σύντομα διαθέσιμο!";


var msg_reg_step1 = "Η εγγραφή σας ανοίγει έναν κόσμο από δυνατότητες!";
var msg_reg_step2 = "Ένα ακόμα βήμα για να δημιουργηθεί το προφίλ σας!";
var msg_reg_successful = "Η εγγραφή ήταν επιτυχής!";
var msg_reg_error = "Η εγγραφή απέτυχε. Δείτε το μήνυμα λάθους και επιστρέψτε σε προηγούμενο βήμα για να το διορθώσετε";

//Titles;
var strings=namespace("AVMap.titles");
strings.AppManager = {
	grid_AppLogo: "Λογότυπο",
	grid_AppName: "Όνομα",
	grid_AppOwner: "Δημιουργός",
	grid_AppPrefix: "Αναγνωριστικό",
	grid_AppWelcome: "Εισαγωγικό κείμενο",
	grid_AppURLS: "Αρ. Διευθύνσεων",
	grid_AppMAPS: "Αρ. Χαρτών",
	grid_AppLogo1: "Επιπλέον λογότυπο",
	grid_AppLogo2: "Επιπλέον 2ο λογότυπο",
	grid_selectBox: "Κλικ για επιλογή/αποεπιλογή",
	grid_Style_Name: "Όνομα",
	grid_Style_IsActive: "Ενεργό",
	grid_Style_Published: "Δημοσιευμένο",
	grid_Style_Preview: "Προεπισκόπηση",
	err_notAuthorized: "Δεν έχετε εξουσιοδότηση για ρυθμίσεις σε αυτή την εφαρμογή",
	logo_selected: "Μπορείτε να δείτε την προεπισκόπηση πηγαίνοντας πίσω στην εφαρμογή",
	logo_updated: "Το λογότυπο αποθηκεύτηκε",
	settings_updated: "Οι ρυθμίσεις αποθηκεύτηκαν.",
	appSetings_Label: "Ρυθμίσεις για την εφαρμογή",
	usergrid_UserID: "ID",
	usergrid_UserFirstName: "Όνομα",
	usergrid_UserLastName: "Επώνυμο",
	usergrid_UserEmail: "Email",
	usergrid_Username: "Username",
	urlgrid_URL: "Διεύθυνση",
	amenu_Apps_Manager_ActionNew: "Νέα",
	amenu_Apps_Manager_ActionEdit: "Ρυθμίσεις",
	amenu_Apps_Manager_ActionStyle: "Εμφάνιση",
	amenu_Apps_Manager_ActionDelete: "Διαγραφή",
	amenu_Apps_Config_ActionSave: "Αποθήκευση",
	amenu_Apps_Config_ActionCancel:"Ακύρωση",
	amenu_Maps_Manager_ActionNew: "Νέος",
	amenu_Maps_Manager_ActionEdit: "Ρυθμίσεις",
	amenu_Maps_Manager_ActionDelete: "Διαγραφή",
	addAlias_WindowTitle: "Προσθήκη νέας διεύθυνσης",
	addAlias_err_InvalidUrl: "Μη έγκυρη μορφή",
	addAlias_err_PlatformRejected: "Η διεύθυνση χρησιμοποιείται ήδη",
	addAlias_err_MyGISRejected: "Η διεύθυνση χρησιμοποιείται από άλλη εφαρμογή",
	addAlias_err_PortNumber: "1-65535",
	addAlias_operationSuccess: "Η διεύθυνση προστέθηκε",
	deleteAlias_err_NotAll: "Δε μπορείτε να διαγράψετε όλες τις διευθύνσεις χωρίς να διαγράψετε την εφαρμογή.",
	deleteAlias_err_YouSure: "διαγράψετε ({0}) διευθύνσεις. Είστε σίγουροι;",
	urls_updated: "Αφαιρέθηκαν διευθύνσεις",
	addApp_WindowTitle: "Προσθήκη νέας εφαρμογής",
	addApp_err_NotFilled: "Πρέπει να δώσετε ένα όνομα",
	addApp_err_InvalidName: "Υπάρχουν μη έγκυρα σύμβολα στο όνομα",
	addApp_msg_Success: "Η εφαρμογή δημιουργήθηκε. Κάντε κλικ για ρυθμίσεις.",
	msg_NotifyUnsaved: "Αποθηκεύστε τις αλλαγές",
	window_NewStyle: "Δημιουργία νέου στυλ",
	window_EditStyle: "Επεξεργασία στυλ",
	window_StyleManager: "Διαχειριστής στυλ",
	addStyle_NewStyleName: "Νέο στυλ",
	addStyle_CopySuffix: " - Αντίγραφο ",
	upmenu_ProfileInfo_Save:"Αποθήκευση αλλαγών",
	upmenu_ProfileInfo_SaveSuccess:"Οι αλλαγές σας αποθηκεύτηκαν",
	upmenu_ProfileInfo_Cancel: "Ακύρωση αλλαγών",
	upmenu_ProfileInfo_CancelSuccess: "Οι αλλαγές ακυρώθηκαν"
};
strings.MapManager= {
  loadWindowTitle: "Σύνδεση χάρτη",
  err_notEnoughSelected: "Πρέπει να επιλέξετε τουλάχιστον ({0}) χάρτες!",
  mapOwnershipType1: "Δική μου δημιουργία",
  mapOwnershipType2: "Αγορά ({0})",
  mapOwnershipType3: "Δική μου δημιουργία",
  mapOwnershipType4: "Συνδρομή ({0})",
  mapOwnershipType5: "Αγορά (Δωρεάν)",
  mapCheckAllTitle: "Επιλογή όλων",
  mapUncheckAllTitle: "Αποεπιλογή όλων",
  mapSettingsLabel: "Ρυθμίσεις του χάρτη",
  addMap_err_NotFilled:"Πρέπει να δώσετε ένα όνομα",
  addMap_err_InvalidName: "Υπάρχουν μη έγκυρα σύμβολα στο όνομα",
  addMap_msg_Success: "Ο χάρτης δημιουργήθηκε. Κάντε κλικ για ρυθμίσεις.",
  addMap_windowTitle: "Ορισμός νέου χάρτη",
  window_NewQS: "Νέο γρήγορο φίλτρο",
  window_EditQS: "Επεξεργασία φίλτρου",
  window_QSManager: "Διαχειριστής φίλτρων",
  window_LayerManager: "Διαχειριστής επιπέδων",
  window_NewMacro: "Νέα μακροεντολή",
  window_EditMacro: "Επεξεργασία μακροεντολής",
  window_MacroManager: "Διαχειριστής μακροεντολών",
  settings_updated: "Οι ρυθμίσεις αποθηκεύτηκαν.",
  qsGrid_colWindowName: "Τίτλος",
  qsGrid_colLayerName: "Επίπεδο",
  qsGrid_colFieldName: "Πεδίο",
  qsNew_err_NoLayer: "Πρέπει να επιλέξετε επίπεδο!",
  qsNew_err_NoField: "Πρέπει να επιλέξετε πεδίο!",
  qsNew_err_NoTitle: "Πρέπει να συμπληρώσετε τον τίτλο!",
  qsNew_msg_Success: "Το φίλτρο αποθηκεύτηκε.",
  macroGrid_colID: "ID",
  macroGrid_colName: "Όνομα",
  macroGrid_colApp: "Εφαρμογή",
  macroGrid_colBtn: "Κουμπί",
  macroGrid_colRegister: "Για logged-in",
  macroTip_name: "Το όνομα της μακροεντολής. Αν είναι κουμπί, θα μπει σαν κείμενο για το κουμπί.",
  macroTip_jselector: "Ένας JQuery selector για το που θα τοποθετηθεί το κουμπί. Παράδειγμα: #middlePane",
  macroTip_button: "Εάν η μακροεντολή θα χρησιμοποιηθεί σαν κουμπί. Αλλιώς καλείται σαν mygis.Macros.XXX όπου ΧΧΧ το όνομα που δώθηκε.",
  macroTip_registered: "Εάν η μακροεντολή είναι διαθέσιμη μόνο όταν ο χρήστης έχει κάνει log in.",
  macroTip_app: "Η εφαρμογή στην οποία θα είναι διαθέσιμη η μακροεντολή",
  macroPopup_window: "Οδηγός αναδυόμενου παραθύρου"
};
strings.UserManager={
	amenu_Users_Manager_ActionNew: "Νέος",
	amenu_Users_Manager_ActionEdit: "επεξεργασία",
	amenu_Users_Manager_ActionDelete: "Διαγραφή",
	col_userLastname: "Επώνυμο",
	col_userFirstname: "Όνομα",
	col_userName: "Όνομα χρήστη",
	col_userEmail: "Email",
	col_userID: "User ID",
	deleteConfirmation: "διαγράψετε {0} χρήστη/ες. Είστε σίγουροι;",
	userDeletedFeedback: "Ο/οι χρήστης/ες διαγράφηκαν",
	usersNotDeleted: "Υπήρξε σφάλμα: "
};
strings.Editing = {
	loseChanges: "Χάσετε τις μη αποθηκευμένες αλλαγές",
	deleteObject: "Διαγράψετε τo επιλεγμένo αντικείμενo",
	noEditingForDigi: "<p>ψηφιοποιήσετε, αλλά δεν έχετε θέσει κάποιο επίπεδο ως επεξεργάσιμο.</p><p>Μήπως θα θέλατε να ψηφιοποιήσετε σε ένα νέο επίπεδο;</p>",
	tempNewObj: "Το νέο αντικείμενο έχει προστεθεί προσωρινά στο επίπεδο ",
	newObjTitle: "Νέο αντικείμενο",
	noEditingForce: "Πρέπει να ορίσετε πρώτα ένα επίπεδο ως επεξεργάσιμο",
	wrongLayerType: "Το επίπεδο που επιλέξατε έχει δηλωθεί να περιέχει μόνο αντικείμενα τύπου: ",
	btnAttachImage: "Επισύναψη εικόνας",
	btnAttachFile: "Επισύναψη αρχείου",
	gridFile_colThumb: "Εικόνα",
	gridFile_colName: "Όνομα",
	gridFile_colActions: "Ενέργειες",
	btnImage_download: "Κατέβασμα",
	btnImage_fullZoom: "Προβολή",
	trueValue: "Ναι",
	falseValue: "Όχι",
	clickToEdit:"Κλικ για επεξεργασία",
	pleaseSelect:"Επιλέξτε τιμή",
	addImage: "Προσθήκη εικόνας",
	addFile: "Προσθήκη αρχείου",
	saveNewObjQuestion:"Αποθηκεύσετε το νέο αντικείμενο",
	loseAllChanges: "Χάσετε όλες τις αλλαγές, γιατί υπάρχουν λάθη στα πεδία.ΤΟ ΑΝΤΙΚΕΙΜΕΝΟ ΔΕ ΘΑ ΑΠΟΘΗΚΕΥΤΕΙ.",
	temporaryError: "Προσωρινό σφάλμα, παρακαλώ προσπαθήστε ξανά."
}
strings.Registration={
	infoTitle: 'Ελάτε μαζί μας...είναι δωρεάν!'
};
strings.Login={
	infoTitle: 'Είσοδος',
	notLoggedIn: 'Δεν είστε logged in',
	welcomeTo: "Καλώς ήρθατε στο "
};
strings.MapRMenu={
	zoomin: 'Μεγέθυνση εδώ',
	zoomout: 'Σμίκρυνση από εδώ',
	center: 'Εστίαση εδώ'
};
strings.ObjRMenu={
	rename: 'Μετονομασία',
	edit: 'Eπεξεργασία',
	deleteMe: 'Διαγραφή',
	styleMe: 'Αλλαγή στυλ',
	zoomin: 'Μεγέθυνση',
	zoomout: 'Σμίκρυνση',
	fitBounds: 'Μεγέθυνση εδώ'
};
strings.MediaManager={
	windowTitle: 'Διαχειριστής πολυμέσων',
	filetype_Image: 'Εικόνα',
	filetype_Document: 'Έγγραφο',
	filetype_Other: 'Άλλο',
	span_outOf: 'από τα',
	btnAttachNew: 'Επισύναψη νέου αρχείου',
	mm_err_noSpace: 'Δεν υπάρχει αρκετός χώρος χρήστη. Δοκιμάστε να διαγράψετε κάποια αρχεία πρώτα.',
	mm_err_invalidUser: 'Μη εξουσιοδοτημένος χρήστης για αυτή την ενέργεια',
	mm_err_unknown: 'Άγνωστο σφάλμα',
	mm_err_notEnoughSelected: 'Πρέπει να επιλέξετε {0} αντικείμενο/αντικείμενα',
	btnSelectAll: 'Επιλογή όλων',
	btnUnselectAll: 'Αποεπιλογή όλων',
	btnAttachFile: 'Ανέβασμα νέου αρχείου',
	btnAttachComplete: 'Ολοκλήρωση'
};
strings.MapControl={
	gotoLayer: 'Κλικ για να δείτε τα επίπεδα',
	currentMap: 'Προεπιλεγμένος χάρτης',
	loadingMap: 'Φόρτωση χάρτη:',
	loadMapTooltip: 'Φόρτωση χάρτη',
	loadingMapLayer: 'επίπεδα',
	info_switch_backgrounds: 'Αλλαγή υποβάθρου λόγω επιπέδου zoom',
	col_mapName: 'Όνομα',
	col_mapDescr: 'Περιγραφή',
	col_mapLCount: 'Επίπεδα',
	col_mapDefault: 'Αρχικός',
	col_mapCreate: 'Δημιουργήθηκε στις',
	col_mapUpdate: 'Ενημερώθηκε στις',
	col_mapDeveloped: 'Αναπτύχθηκε από',
	col_mapOwner: 'Ιδιοκτήτης',
	col_mapIsPublic: 'Δημόσιος χάρτης',
	col_mapAmOwner: 'Ιδιοκτησία',
	col_mapAmCreator: 'Είμαι δημιουργός',
	col_mapAmSubsciber: 'Είμαι συνδρομητής',
	col_mapOwnership: "Τρόπος κτήσης",
	loadMapConfirm: 'Φορτώσετε έναν νέο χάρτη. Είστε σίγουροι;'
};
strings.MapTools= {
	mode_TopSelect: "Επιλέγει αντικείμενα μόνο από το πρώτο επίπεδο",
	mode_InfoSelect: "Εμφάνιση λίστας αποτελεσμάτων",
	mode_InfoStore:"Αποθήκευση επιλογής στο 'Αναζητήσεις'",
	mode_AddSelect: "Προσθήκη στα ήδη επιλεγμένα",
	mode_SubtractSelect: "Αφαίρεση από τα ήδη επιλεγμένα",
	editModeCopy: "Αντιγραφή της επιλογής",
	editModePaste:"Επικόλληση της επιλογής",
	editModeDelete: "Διαγραφή των επιλεγμένων αντικειμένων",
	editModeDrag: "Μετακίνηση του επιλεγμένου",
	editModeRotate: "Περιστροφή του επιλεγμένου",
	editModeResize: "Αλλαγή μεγέθους του επιλεγμένου",
	editModeReshape: "Αλλαγή σχηματος του επιλεγμένου",
	mode_EditableInfo: "Ψηφιοποίηση με εισαγωγή στοιχείων",
	mode_Grouping: "Ψηφιοποίηση διαφορετικών σχημάτων για το ίδιο αντικείμενο",
	mode_Snap: "Ψηφιοποίηση με snapping",
	dragPanBtn: "Πλοήγηση σε χάρτη",
	zoomBoxBtn: "Μεγέθυνση χάρτη (Κρατήστε πατημένο το κλικ για να επιλέξετε την περιοχή που σας ενδιαφέρει)",
	zoomOutBtn: "Σμίκρυνση Χάρτη",
	toggleInfoBtn: "Εργαλείο 'Τι υπάρχει εδώ;'",
	selectObject: "Επιλογή σε σημείο",
	infoTool: "Πληροφορίες",
	selectRect: "Επιλογή περιοχής",
	selectCircle: "Επιλογή κυκλικής περιοχής",	//JK CHANGES
	selectClear: "Καθαρισμός επιλογής",
	markerButton: "Ψηφιοποίηση σημείου",
	polylineButton: "Ψηφιοποίηση γραμμής",
	polygonButton: "Ψηφιοποίηση πολυγώνου",
	rectangleButton:"Ψηφιοποίηση ορθογωνίου",
	mapActionsBtn: "Εμφάνιση/Απόκρυψη εργαλείων χάρτη",
	infoToolExplain:"Επιλέγετε το πρώτο από:",
	otherToolExplain:"Επιλέγετε από:",
	showSearchesBtn: "Εμφάνιση προηγούμενων αναζητήσεων",
	hideSearchesBtn: "Απόκρυψη προηγούμενων αναζητήσεων"
};
strings.LayerControl={
	noObjectTitle:"Αντικείμενο ",
	tipEdit: "Διπλό κλικ σε ένα αντικείμενο για επεξεργασία του ονόματος",
	moveUp: "Μετακίνηση πάνω",
	moveDown: "Μετακίνηση κάτω",
	gotoTable: "Κλικ για να δείτε τον πίνακα αντικειμένων",
	treeNodeData: "Επίπεδα δεδομένων",
	treeNodeBackground: "Επίπεδα υποβάθρου",
	invalidReorder: "Μη έγκυρη τιμή. Πρέπει να είναι από 1 έως ",
	columnIcon: "Εικόνα",
	columnVisible: "Ορατό",
	columnEditable: "Επεξεργάσιμο",
	columnSelectable: "Επιλέξιμο",
	columnLocked: "Κλειδωμένο",
	columnProperties: "Ενέργειες",
	columnName: "Όνομα",
	columnType: "Επίπεδα",
	columnCycle: "Εναλλαγή υποβάθρων",
	typeData: "δεδομένα",
	typeBackground: "υπόβαθρα",
	propertiesNotForBG: "Δεν υπάρχουν διαθέσιμες ενέργειες για υπόβαθρα",
	visibleRangeNotFilled: "Μη έγκυρη τιμή",
	labelBackground: "Υπόβαθρο ",
	saveChanges: "Αποθήκευση αλλαγών",
	newLayerWindowTitle: "Νέο επίπεδο",
	layergrid_colName: "Όνομα",
	layergrid_colDescription: "Περιγραφή",
	layergrid_colTable: "Συνδεδεμένα δεδομένα",
	layergrid_colGeom: "Γεωγραφικός τύπος",
	layergrid_colPoints: "Σημεία",
	layergrid_colLines: "Γραμμές",
	layergrid_colPolygons: "Πολύγωνα",
	layergrid_colTableApp: "Εφαρμογή προέλευσης",
	layergrid_colFolder: "Όνομα ομαδοποίησης",
	err_notEnoughSelected: "Πρέπει να επιλέξετε τουλάχιστον ({0}) επίπεδα!",
	tip_ChangeBG: 'Δείτε πώς μπορείτε να αλλάξετε υπόβαθρο κάνοντας κλικ <a href="#" class="notifyAction" onclick="router(\'wizard_ChangeBG\',this);return false;">εδώ</a>',
	tip_ChangeBG_cb: "Κλικ εδώ!",
	noFolderName: "Δεδομένα χάρτη"
};
strings.Export={
	defaultDocumentTitle: "Digitized KML file",
	defaultDocumentDescription: "Source: http://www.MyGIS.gr",
	saveAsWindowTitle: "Αποθήκευση ως"
};
strings.Info={
	windowTitle: "Πληροφορίες",
	windowTitleQuery: "Αποτελέσματα αναζήτησης",
	section1: "ΠΛΗΡΟΦΟΡΙΕΣ",
	section2: "ΕΙΚΟΝΕΣ",
	section3: "ΑΡΧΕΙΑ",
	section4: "Σύνδεσμοι",
	showAll: "Εμφάνιση όλων",
	infoAt: "Τι υπάρχει στο σημείο ",
	btnSelectAll: "Επιλογή όλων",
	btnSelectNone: "Αποεπιλογή όλων",
	mapSelectionQText: "Επιλογή σε χάρτη στις ",
	mapSelectionDefaultQText: "Τελευταία επιλογή σε χάρτη",
	err_AtLeastOne: "Πρέπει να έχετε επιλέξει τουλάχιστον μία εγγραφή!",
	emptyPreview: "Δεν έχετε επιλέξει αρχείο για προεπισκόπηση!",
	infoWindowSubPart1:'στο επίπεδο "',
	infoWindowSubPart2:'"',
	selectDeselect: "Κρατήστε πατημένο το CTRL για πολλαπλή επιλογή/αποεπιλογή",
	infoImagesBtn: "Δείτε όλες τις εικόνες",
	noResults: "Δεν βρέθηκαν αποτελέσματα"
};
strings.Grid={
	groupsheaderstring: "Σύρετε μια στήλη εδώ για να ομαδοποιήσετε κατά αυτή.",
	sortascendingstring: "Αύξουσα ταξινόμηση",
	sortdescendingstring: "Φθίνουσα ταξινόμηση",
	sortremovestring: "Αφαίρεση ταξινόμησης",
	groupbystring: "Ομαδοποίηση βάσει αυτής",
	groupremovestring: "Αφαίρεση ομαδοποίησης"	
};
strings.QBuilder={
	windowTitle: "Δημιουργία αναζήτησης",
	windowClose: "ΑΠΟΚΡΥΨΗ",
	keywordSELECT: "ΕΜΦΑΝΙΣΗ",
	keywordALL: "ΌΛΩΝ",
	keywordFROM: "ΑΠΟ",
	keywordWHERE: "ΟΠΟΥ",
	keywordALSO: "ΕΠΙΣΗΣ",
	keywordNULL: "{ΚΕΝΟ}",
	panelTitle: "Καθώς και",
	feed_SearchSuccess:"Επιτυχημένη αναζήτηση ",
	runQuery: "Εκτέλεση",
	deleteQuery: "Διαγραφή αναζήτησης",
	friendlyNameDef: "Αναζήτηση στις ",
	runQueryConfirm: 'τρέξετε μια προηγούμενη αναζήτηση.',
	statsTitle: 'Στατιστική ανάλυση αποτελεσμάτων',
	datatypeText: "Κείμενο",
	datatypeNumeric: "Αριθμητικό",
	statSum: "Άθροισμα",
	statMin: "Ελάχιστο",
	statMax: "Μέγιστο",
	statAvg: "Μέση τιμή",
	statCount: "Σύνολο διακριτών",
	statResultIn: "από",
	statsFieldNameBefore: "Για το πεδίο",
	statsFieldNameAfter: "που βρέθηκε σε"
};
strings.BackgroundLayers={
	mygis_cachedICEDS: "Δορυφορική BlueMarble",
	mygis_cachedICEDS_attrib: "University College London",
	ktimatologio: "Αερ/φίες κτηματολογίου",
	ktimatologio_attrib: "Κτηματολόγιο Α.Ε.",
	opengeo_BLUEMARBLE: "Δορυφορική BlueMarble",
	opengeo_BLUEMARBLE_attrib: "OpenGeo.org",
	opengeo_OSM: "Χάρτες OpenStreet",
	opengeo_OSM_attrib:"OpenGeo.org",
	nasa_LANDSAT: "Δορυφορική Landsat 7",
	nasa_LANDSAT_attrib: "NASA Jet Propulsion Laboratory",
	nasa_name: "Δορυφορική NASA",
	nasa_attribution: "NASA",
	landsat_name: "Δορυφορική Landsat 5",
	landsat_attribution: "University College London",
	ktimatologio_name: "Αεροφωτογραφίες κτημ/γίου",
	ktimatologio_attribution: "Κτηματολόγιο Α.Ε.",
	google_hybrid: "Υβδριδικός χάρτης",
	google_satellite: "Δορυφορικός χάρτης",
	google_roadmap: "Οδικός χάρτης",
	google_terrain: "Εδαφικός χάρτης"
};
strings.ConfirmBox={
	buttonConfirm: "Επιβεβαίωση",
	buttonCancel: "Ακύρωση",
	msg_qb_resetcrit: 'καθαρίσετε τα κριτήρια αναζήτησης',
	msg_lc_removemap: 'αφαιρέσετε ένα επίπεδο από τον χάρτη'
};
strings.QuickJump={
	placeholder: "Εντοπίστε μια τοποθεσία"
};
strings.Coding={
	badAttribution: 'γεωγραφικά δεδομένα Δήμου Χίου',
	noBackground: 'Χωρίς υπόβαθρο',
	loadingStep1: 'Φόρτωση στυλ',
	loadingStep2: 'Φόρτωση διαθέσιμων χαρτών',
	loadingStep3: 'Φόρτωση διαθέσιμων επιπέδων',
	loadingStep4: 'Φόρτωση χάρτη',
	loadingStep5: 'Αρχικοποίηση εργαλείων',
	seconds: " δευτ/πτα",
	promptThemeChoose: "- Επιλογή εμφάνισης -"
};
strings.HelpSystem={
	startHereTitle: "Χάρτης",
	manual: "Ξεκινήστε εδώ",
	mapResults: "Κάντε κλικ εδώ για να βλέπετε την βάση δεδομένων κατά την πλοήγηση στον χάρτη"
};
strings.UserProfile={
	updateSuccess: "Επιτυχής ενημέρωση προφίλ"
};
strings.Printing={
	statsWindowTitle: "ΣΤΑΤΙΣΤΙΚΗ ΑΝΑΛΥΣΗ ΑΠΟΤΕΛΕΣΜΑΤΩΝ"
}
function namespace(namespaceString) {
    var parts = namespaceString.split('.'),
        parent = window,
        currentPart = '';

    for(var i = 0, length = parts.length; i < length; i++) {
        currentPart = parts[i];
        parent[currentPart] = parent[currentPart] || {};
        parent = parent[currentPart];
    }

    return parent;
}