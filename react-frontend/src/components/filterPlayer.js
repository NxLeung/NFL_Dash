import playerList from "../playerList.json";

export default function filter(searchText, maxResults) {
  return playerList
    .filter(player => {
      if (player.title.toLowerCase().includes(searchText.toLowerCase())) {
        return true;
      }
      // if (player.keywords.includes(searchText)) {
      //   return true;
      // }
      return false;
    })
    .slice(0, maxResults);
}
