import { useMemo } from "react";

const useFilteredConversations = (searchTerm, conversations, users) => {
  return useMemo(() => {
    if (!searchTerm) return conversations;

    const conversationMap = new Map();
    for (let convo of conversations) {
      conversationMap.set(convo.user_id);
    }
    const filteredConversations = (conversations || []).filter((convo) =>
      convo.username.includes(searchTerm)
    );

    const usersNotInConversations = users.filter(
      (user) => user.username.includes(searchTerm) && !conversationMap.has(user.id)
    );

    console.log("FilteredConversations?", [...filteredConversations, ...usersNotInConversations]);
    return [...filteredConversations, ...usersNotInConversations];
  }, [searchTerm, conversations, users]);
};

export default useFilteredConversations;
