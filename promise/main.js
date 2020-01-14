(function() {
    const promise = new Promise((resolve, reject) => {
        const a = 1;
        if (a !== 1) {
            resolve(1);
        } else {
            reject(0);
        }
    });
    promise.then((value) => console.log(value), (value) => console.log('reject:', value));
}());

(function() {
    // Promise新建后立即执行
    const promise = new Promise((resolve, reject) => {
        console.log('Promise');
        resolve();
    });

    promise.then(() => console.log('resolved'));

    console.log('Hi');
}());

function loadImageAsync(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Could not load image at ' + url));
        img.src = url;
    });
}

const getJSON = (url) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.responseType = 'json';
        xhr.onreadystatechange = () => {
            if (this.readyState !== 4) {
                return;
            }

            if (this.status === 200) {
                resolve(this.response);
            } else {
                reject(new Error(this.statusText));
            }
        };
        xhr.send();
    });
};

// getJSON('/posts.json').then((json) => console.log('Content: ' + json), (error) => console.error('出错了', error));

(function () {

}());
