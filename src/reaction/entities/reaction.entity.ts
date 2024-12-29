import { $Enums} from "@prisma/client";

export class ReactionData {
  reaction: number;
  userReactionType: $Enums.ReactionType | null;
}
