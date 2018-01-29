export default function(arr, key = 'id', labelKey = 'value') {
  return arr.map((item, index) => {

    var label = item[labelKey] || item;

    return {
      value: item[key] || (index + 1),
      label
    };
  });
}
