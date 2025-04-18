import { useState } from "react";
import VideoList from "./VideoList";

function SearchableVideoList({ videos }) {
  const [searchText, setSearchText] = useState("");
  const foundVideos = filterVideos(videos, searchText);
  return (
    <>
      <SearchInput
        value={searchText}
        onChange={(newText) => setSearchText(newText)}
      />
      <VideoList
        videos={foundVideos}
        emptyHeading={`No matches for “${searchText}”`}
      />
    </>
  );
}

export default SearchableVideoList;
