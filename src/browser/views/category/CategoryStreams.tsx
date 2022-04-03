import React, { FC, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import tw, { styled } from "twin.macro";

import { t } from "@/common/helpers";

import { filterList, isEmpty } from "@/browser/helpers/array";
import { useStreams } from "@/browser/helpers/queries";

import StreamCard from "@/browser/components/cards/StreamCard";
import MoreButton from "@/browser/components/MoreButton";
import Splash from "@/browser/components/Splash";

const List = styled.div`
  ${tw`pt-2`}
`;

const Item = styled.div``;

const LoadMore = styled.div`
  ${tw`p-3`}
`;

const CategoryStreams: FC = () => {
  const { category, searchQuery } = useOutletContext<any>();

  const [streams, { error, fetchMore, hasMore, isLoadingMore }] = useStreams({
    game_id: category.id,
  });

  const filteredStreams = useMemo(
    () => filterList(streams, ["game_name", "title", "user_login"], searchQuery),
    [streams, searchQuery]
  );

  if (error) {
    return <Splash>{error.message}</Splash>;
  }

  if (streams == null) {
    return <Splash isLoading />;
  }

  if (isEmpty(filteredStreams)) {
    return <Splash>{t("noStreamsFound")}</Splash>;
  }

  return (
    <>
      <List>
        {filteredStreams.map((stream) => (
          <Item key={stream.id}>
            <StreamCard stream={stream} />
          </Item>
        ))}
      </List>

      {hasMore && (
        <LoadMore>
          <MoreButton isLoading={isLoadingMore} fetchMore={fetchMore}>
            {t("loadMore")}
          </MoreButton>
        </LoadMore>
      )}
    </>
  );
};

export default CategoryStreams;
