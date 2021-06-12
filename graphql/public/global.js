
const limit = process.env.Limit;

const getSkip  = (page) => {
  if (!page){
    return 0
  }
  else{
    page = (page * limit) - limit;
    return page;
  }
}

module.exports = { getSkip, limit}
