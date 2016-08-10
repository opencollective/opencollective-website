/**
 * Converts relative URI to absolute URI
 */
export default (relative) => {
	var a = document.createElement('a');
	a.href = relative;
	return a.href;
};
