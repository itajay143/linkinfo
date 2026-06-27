import { Link } from "@linkinfo/prisma/client";
import { prisma } from "@linkinfo/prisma";
import { createFile } from "@linkinfo/filesystem";
import { generatePreview } from "@linkinfo/lib/generatePreview";
import { safeFetch } from "@linkinfo/lib/safeFetch";

const imageHandler = async ({ url, id }: Link, extension: string) => {
  const buffer = await safeFetch(url as string).then((res) => res.buffer());

  if (
    Buffer.byteLength(buffer) >
    1024 * 1024 * Number(process.env.SCREENSHOT_MAX_BUFFER || 100)
  )
    return console.log("Error archiving as Screenshot: Buffer size exceeded");

  const linkExists = await prisma.link.findUnique({
    where: { id },
  });

  if (linkExists) {
    await generatePreview(buffer, linkExists.collectionId, id);

    await createFile({
      data: buffer,
      filePath: `archives/${linkExists.collectionId}/${id}.${extension}`,
    });

    await prisma.link.update({
      where: { id },
      data: {
        image: `archives/${linkExists.collectionId}/${id}.${extension}`,
      },
    });
  }
};

export default imageHandler;
