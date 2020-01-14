export default function mixins(...list) {
  return (target) => Object.assign(target.prototype, ...list);
}
