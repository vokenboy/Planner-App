import React, { useEffect, useState } from "react";
import { Alert, View, StyleSheet, Text, FlatList, TouchableOpacity, ScrollView } from "react-native";
import TextInputBar from "../TextInputBar";
import ButtonComp from '../ButtonComp';
import { loginUserAPI } from '../API/Users/UsernameCheck';
import { inviteToGroup } from '../API/Invites/InviteToGroup';
import { getGroupMembers } from '../API/Groups/GroupMembers';
import { getGroupId } from "../Storage/userDataStorage";
import { getUserId } from "../Storage/userDataStorage";
import { deleteUser } from "../API/Groups/RemoveUser";
import { GlobalColor, GlobalFont, GlobalHeaderColor, GlobalRedButtonColor, GlobalSecondaryColor, GlobalTextColor } from '../../Styles';
import Toast from 'react-native-toast-message';
import { getGroupName } from "../API/Groups/GroupName";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { deleteGroup } from "../API/Groups/DeleteGroup";
import { changeOwnership } from "../API/Groups/ChangeOwnership";


async function getGroup() {
  const groupId = await getGroupId();
  return groupId;
}

async function getUser() {
  const userId = await getUserId();
  return userId;
}

const GroupInput = ({ onRefresh }) => {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [members, setMembers] = useState([]);
  const [userId, setUserId] = useState(null);
  const [ownerId, setOwnerId] = useState(null);
  const [groupId, setGroupId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); 


  const handleRefrsh = () => {
    setRefreshKey(oldKey => oldKey + 1);
  }

  useEffect(() => {
    fetchGroupMembers();
    fetchUserId();
  }, [refreshKey]);

  const fetchUserId = async () => {
    const userId = await getUser();
    const groupId = await getGroup();
    const groupNameData = await getGroupName({ groupId: groupId });
    setOwnerId(groupNameData?.owner_id ?? null);
    setUserId(userId);
  }

  const fetchGroupMembers = async () => {
    setIsLoading(true);
    const groupId = await getGroup();
    setGroupId(groupId);
    if (groupId) {
      const groupMembers = getGroupMembers({ groupId }).then((data) => {
        setMembers(data);
      });
      setMembers(groupMembers);
    }
    setIsLoading(false);
  }

  const handleSendInvite = async () => {
    if (!username) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a username',
      });
      return;
    }

    try {
      const fetchedUser = await loginUserAPI({ username });
      if (fetchedUser && fetchedUser.group_id) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'User already in a group',
        });
        return;
      }

      if (fetchedUser && !fetchedUser.group_id) {
        const group_id = await getGroupId();
        const invite = await inviteToGroup({ user_id: fetchedUser.id, group_id });

        if(invite === null) {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Your group has already invited this user!',
          });
        }
        else {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Invitation sent!',
        });
      }
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'User not found',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to send invitation',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveGroup = async () => {
    try {
      const userId = await getUser();
      await deleteUser({ userId: userId });
      onRefresh();
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'You have left the group',
      });
    }
    catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to leave group',
      });
    }
    finally {
      setIsLoading(false);
    }
  }

  const handleDeleteGroup = async () => {
    try {
      setIsLoading(true);
      const groupId = await getGroupId();
      await deleteGroup({ group_id: groupId });
      onRefresh();
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Group has been deleted',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to delete group',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromGroup = async (userId, usernameToRemove) => {
    try {
      setIsLoading(true);

      await deleteUser({ userId: userId });

      const updatedMembers = members.filter(member => member.username !== usernameToRemove);
      setMembers(updatedMembers);

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: `${usernameToRemove} has been removed from the group`,
      });

    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `Failed to remove ${usernameToRemove} from the group`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeOwner = async (groupId, newOwnerId) => {
    try {
        setIsLoading(true);

        await changeOwnership({ groupId, newOwnerId });

        Toast.show({
            type: 'success',
            text1: 'Ownership Change',
            text2: `Group ownership has been successfully changed.`,
        });
        handleRefrsh();

    } catch (error) {
        Toast.show({
            type: 'error',
            text1: 'Ownership Change Error',
            text2: `Failed to change the group owner.`,
        });
    } finally {
        setIsLoading(false);
    }
};

  const renderMember = ({ item }) => (
    <View style={styles.memberItem}>
      <Text style={styles.memberText}>{item.username}</Text>
      {userId === ownerId && item.id !== ownerId && (
        <TouchableOpacity onPress={() => handleChangeOwner(groupId, item.id)}>
          <Text style={styles.changeOwnerText}>Make Admin</Text>
        </TouchableOpacity>
      )}
      {userId === ownerId && item.id !== ownerId && (
        <TouchableOpacity onPress={() => handleRemoveFromGroup(item.id, item.username)}>
          <Text style={styles.removeIcon}>×</Text>
        </TouchableOpacity>
      )}
      {item.id === ownerId && (
        <MaterialCommunityIcons name="crown" style={styles.removeIcon} />
      )}
    </View>
  );

  return (
    <>
      <View style={styles.addContainer}>
        <TextInputBar label="Enter username" onChangeText={setUsername} />
        <ButtonComp text="Add User" onPress={handleSendInvite} />
      </View>
      <View style={styles.container}>
        <Text style={styles.header}>Members</Text>
        <FlatList
          data={members}
          renderItem={renderMember}
          keyExtractor={item => item.id}
          style={styles.membersList}
        />
      </View>
      { userId !== ownerId && (
      <View style={styles.leaveButton}>
        <ButtonComp text="Leave Group" onPress={handleLeaveGroup} color={GlobalRedButtonColor}/>
      </View>
    )}
      { userId === ownerId && (
      <View style={styles.leaveButton}>
        <ButtonComp text="Delete Group" onPress={handleDeleteGroup} color={GlobalRedButtonColor}/>
      </View>
    )}
    </>
  );
};

const styles = StyleSheet.create({
  addContainer: {
    marginTop: 20,
    gap: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: GlobalSecondaryColor,
    borderRadius: 10,
    padding: 10,
    margin: 20,
    alignItems: 'stretch',
  },
  memberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    backgroundColor: { GlobalSecondaryColor },
  },
  memberText: {
    color: GlobalTextColor,
    fontSize: 20,
  },
  removeIcon: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    padding: 8,
  },
  changeOwnerText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  membersList: {
    flexGrow: 0,
    height: 200,
  },
  header: {
    color: GlobalHeaderColor,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  leaveButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -5,
  },
});

export default GroupInput;
