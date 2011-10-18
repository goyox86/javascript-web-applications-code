var Model.LocalStorage = {
  saveLocal: function(name) {
    // Turn records into an array
    var result = [];
    for (var i in this.records)
    result.push(this.records[i])

    localStorage[name] = JSON.stringify(result);
  },
  loadLocal: function(name) {
    var result = JSON.parse(localStorage[name]); 
    this.populate(result);
  } 
};