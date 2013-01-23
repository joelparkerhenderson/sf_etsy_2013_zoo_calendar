// Because of security restrictions, getImageFromUrl will
// not load images from other domains.  Chrome has added
// security restrictions that prevent it from loading images
// when running local files.
//
// To temporarily get around this issue, run with:
//
//     chromium --allow-file-access-from-files --allow-file-access

var getImageData = function(url, callback) {
    var img = new Image, data, ret={data: null, pending: true};

    img.onError = function() {
        throw new Error('Cannot load image: "'+url+'"');
        }
    img.onload = function() {
        var canvas = document.createElement('canvas');
        document.body.appendChild(canvas);
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        // Grab the image as a jpeg encoded in base64, but only the data
        data = canvas.toDataURL('image/jpeg').slice('data:image/jpeg;base64,'.length);
        // Convert the data to binary form
        data = atob(data)
        document.body.removeChild(canvas);

        ret['data'] = data;
        ret['pending'] = false;
        if (typeof callback === 'function') {
            callback(data);
            }
        }
    img.src = url;

    return ret;
}
