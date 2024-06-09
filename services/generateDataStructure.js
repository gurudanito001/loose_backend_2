
const deriveDataType = (value)=>{
  let result = typeof(value);
  if(result === "object"){
    if(Array.isArray(value)){
      result = "array";
    }
  }
  return result;
}

const structureGenerator = (data) =>{
  let dataKeys = Object.keys(data);
  let structure = {}

  for (let i = 0; i < dataKeys.length; i++) {
    structure[dataKeys[i]] = deriveDataType(data[dataKeys[i]]);
  }

  return structure
}

export default structureGenerator;