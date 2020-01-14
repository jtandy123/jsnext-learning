/**
 *
 */
const clone = (parent) => {
    // 维护两个存储循环引用的数组
    const parents = [];
    const children = [];

    const _clone = (parent) => {
        if (parent === null) {
            return null; // null
        }
        if (typeof parent !== 'object') {
            return parent; // undefined string number boolean Symbol
        }

        let child;
        let proto;

        if (Array.isArray(parent)) {
            child = [];
        } else if (Object.prototype.toString.call(parent) === '[object RegExp]') {
            child = new RegExp(parent.source, parent.flags);
        } else if (Object.prototype.toString.call(parent) === '[object Date]') {
            child = new Date(parent.getTime());
        } else {
            proto = Object.getPrototypeOf(parent);
            child = Object.create(proto);
        }

        // 处理循环引用
        const index = parents.indexOf(parent);
        if (index !== -1) {
            return children[index];
        }
        parents.push(parent);
        children.push(child);

        // 递归处理数组和普通对象
        for (let i in parent) {
            if (parent.hasOwnProperty(i)) {
                child[i] = _clone(parent[i]);
            }
        }

        return child;
    };

    return _clone(parent);
};

module.exports = {clone};
