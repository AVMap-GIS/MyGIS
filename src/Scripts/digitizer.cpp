
/**
*	@namespace mygis Root of MyGIS
*/

/**
* @namespace mygis.Storage storage related methods
*/

class Element;
class String;
class contextMenu;
int myguid;
int objcmenu;
int cmenu;
int extra;
int mapContainerPosition;
int autocomplete;
int geoXml;
int featuresModified;
int drawingManager;
int digiContainer;
int selectionWMSLayer;
int filledMode;
int wmsHighlight;
int countMarkers;
int real_editMode;
int rightmenuOpen;

/**
 * Removes the specified class name from the object
 * @param strClass The class name to remove
 */
void Element::ex_RemoveClassName(void strClass) { }

/**
 * Adds the specified class name to the object.
 * @param strClass The class name to add
 * @param blnMayAlreadyExist If the class name is allowed to already exist.
 */
void Element::ex_AddClassName(void strClass, void blnMayAlreadyExist) { }

/**
 * Returns whether the object has the class name
 * @param strClass Class name to check
 */
void Element::ex_HasClassName(void strClass) { }
int lastCritIndex;
void String::format() { }
int featuresUnsaved;
int saveFlasher;
int selectionLayer;
int toolbarToggling;
int featuresDeleted;
int infoWindows;
int naviControls;
int toolsEnabled;
int cosmeticLayer;
int appPath;
int digiOutLoc;
int selectionFlasher;
int internalConfig;
class contextMenu
{
public:
	void contextMenu(void div) { }
	int create;
	int div;
	void add(void label, void cl, void fnc) { }
	void open(void event, void hack) { }
	void close() { }
	int initTs;
	int clearTs;
	int items;
};

int current;
int digimap;
int criteriaMap;
int infoControls;
int loadGoogleMaps;
int drawControls;
int rightClickedObj;
int postbackurl;
int feedbackLayer;
int config;
int panTimer;

