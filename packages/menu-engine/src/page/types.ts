import type { PageBlock } from "../blocks/types";
import { PublicationStatus } from "../menu";

export type PageId = string;



export type Page = {
  id: PageId;

  slug: string;
  title: string;

  blocks: PageBlock[];

  status: PublicationStatus;
};
