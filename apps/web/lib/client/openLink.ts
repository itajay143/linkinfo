import { LinkIncludingShortenedCollectionAndTags } from "@linkinfo/types/global";
import getFormatBasedOnPreference from "@linkinfo/lib/getFormatBasedOnPreference";
import { LinksRouteTo } from "@linkinfo/prisma/client";

const openLink = (
  link: LinkIncludingShortenedCollectionAndTags,
  user: any,
  openModal: () => void
) => {
  if (user.linksRouteTo === LinksRouteTo.DETAILS) {
    openModal();
  } else {
    const format = getFormatBasedOnPreference({
      link,
      preference: user.linksRouteTo,
    });

    window.open(
      format !== null
        ? `/preserved/${link?.id}?format=${format}`
        : (link.url as string),
      "_blank"
    );
  }
};

export default openLink;
