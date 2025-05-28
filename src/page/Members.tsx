// ✅ 올바른 방식
import { useEffect, useState  } from 'react';
import {
  Table,
  IconButton,
  Heading,
  Box,
  CloseButton,
  Field,
  NativeSelect,
  Pagination,
  Button,
  Input,
  Stack,
  ButtonGroup,
  HStack,
  Fieldset,
  Dialog,
  Portal
} from '@chakra-ui/react';
import { RiDeleteBin6Fill } from "react-icons/ri";
import { MdEditSquare } from "react-icons/md";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu"
import { Member } from '../data/types';
import { initialMembers } from '../data/initialData';
import { toaster } from "../components/ui/toaster"
import { loadFromStorage, saveToStorage } from '../utils/storage';
import { Icon } from "@chakra-ui/react";
import { v4 as uuidv4 } from 'uuid';
import { MEMBERS_KEY } from "../data/constants";

const MembersPage = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');

  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('');
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // 현재 페이지의 멤버 목록만 추출
  const paginatedMembers = members.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    const storedMembers = loadFromStorage(MEMBERS_KEY);
    if (storedMembers && storedMembers.length > 0) {
      setMembers(storedMembers);
    } else {
      setMembers(initialMembers);
      saveToStorage(MEMBERS_KEY, initialMembers);
    }
  }, []);

  const handleDelete = (id: string) => {
    const deletedMember = members.find((m) => m.id === id);
    const updated = members.filter((m) => m.id !== id);
    setMembers(updated);
    saveToStorage(MEMBERS_KEY, updated);
    toaster.create({
      title: "삭제 완료",
      description: `${deletedMember?.name}님이 삭제되었습니다.`,
      type: "success"
    })
  };

  const handleEdit = () => {
    if (!editingMember) return;
    const updated = members.map((m) =>
      m.id === editingMember.id ? { ...m, name: editName, role: editRole } : m
    );
    setMembers(updated);
    saveToStorage(MEMBERS_KEY, updated);
    toaster.create({
      title: "수정 완료",
      description: `${editName}님의 정보가 수정되었습니다.`,
      type: "success",
    });
    setEditingMember(null);
    setIsEditOpen(false);
  }

  const handleAddMember = () => {
    if (!newName.trim() || !newRole.trim()) return;

    const newMember: Member = {
      id: uuidv4(),
      name: newName.trim(),
      role: newRole.trim(),
    };

    const updated = [...members, newMember];
    setMembers(updated);
    saveToStorage(MEMBERS_KEY, updated);
    setNewName('');
    setNewRole('');
  };

  return (
    <Box>
      <Heading size="lg" mb={6}>
        👥 길드원 목록
      </Heading>
      <HStack mb={6}>
        <Input
          placeholder="이름"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          size="sm"
          width="200px"
        />
        <Input
          placeholder="직책"
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          size="sm"
          width="200px"
        />
        <Button size="sm" colorScheme="blue" onClick={handleAddMember}>
          길드원 추가
        </Button>
      </HStack>
      <Stack>
        <Table.Root stickyHeader striped>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>이름</Table.ColumnHeader>
              <Table.ColumnHeader>직책</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">작업</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {paginatedMembers.map((member) => (
              <Table.Row key={member.id}>
                <Table.Cell>{member.name}</Table.Cell>
                <Table.Cell>{member.role}</Table.Cell>
                <Table.Cell textAlign="center">
                <Dialog.Root key={"sm"} size={"sm"} placement={"center"}>
                  <Dialog.Trigger asChild>
                    <IconButton aria-label='삭제' variant={"ghost"}>
                      <Icon as={RiDeleteBin6Fill as any}/>
                    </IconButton>
                  </Dialog.Trigger>
                  <Portal>
                    <Dialog.Backdrop/>
                    <Dialog.Positioner>
                      <Dialog.Content>
                        <Dialog.Header>
                          <Dialog.Title>삭제하시겠습니까?</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                          잘못 삭제하면 클나요
                        </Dialog.Body>
                        <Dialog.Footer>
                          <Dialog.ActionTrigger asChild>
                            <Button variant="outline">Cancel</Button>
                          </Dialog.ActionTrigger>
                          <Button onClick={() => handleDelete(member.id)}>Save</Button>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger asChild>
                          <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                      </Dialog.Content>
                    </Dialog.Positioner>
                  </Portal>
                </Dialog.Root>
                <Dialog.Root key={"lg"} size={"lg"} placement={"center"}>
                  <Dialog.Trigger asChild>
                    <IconButton aria-label="수정" variant="ghost">
                      <Icon
                        as={MdEditSquare as any}
                        boxSize={5}
                        color="gray.600"
                        onClick={() => {
                          setEditingMember(member);
                          setEditName(member.name);
                          setEditRole(member.role);
                          setIsEditOpen(true);
                        }}
                      />
                    </IconButton>
                  </Dialog.Trigger>
                  <Portal>
                    <Dialog.Backdrop/>
                    <Dialog.Positioner>
                      <Dialog.Content>
                        <Dialog.Header>
                          <Dialog.Title>길드원 수정</Dialog.Title>
                          <Dialog.Body>
                            <Fieldset.Root key={"lg"} size={"lg"} maxW="md">
                              <Stack>
                                  <Fieldset.HelperText>
                                    잘 작성하자
                                  </Fieldset.HelperText>
                              </Stack>
                              <Fieldset.Content>
                                <Field.Root>
                                    <Field.Label>닉네임</Field.Label>
                                    <Input
                                      name="nickname"
                                      type="nickname"
                                      onChange={(e) => setEditName(e.target.value) }
                                    />
                                  </Field.Root>
                                  <Field.Root>
                                    <Field.Label>직책</Field.Label>
                                    <NativeSelect.Root>
                                      <NativeSelect.Field name='role' value={editRole} onChange={(e) => setEditRole(e.target.value)}>
                                        {["길드장", "부길드장", "길드원"].map((role) => (
                                          <option key={role} value={role}>{role}</option>
                                        ))}
                                      </NativeSelect.Field>
                                      <NativeSelect.Indicator/>
                                    </NativeSelect.Root>
                                  </Field.Root>
                              </Fieldset.Content>
                            </Fieldset.Root>
                          </Dialog.Body>
                          <Dialog.Footer>
                          <Dialog.ActionTrigger asChild>
                            <Button variant="outline">취소</Button>
                          </Dialog.ActionTrigger>
                          <Button onClick={() => handleEdit()}>수정하기</Button>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger asChild>
                          <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                        </Dialog.Header>
                      </Dialog.Content>
                    </Dialog.Positioner>
                  </Portal>

                </Dialog.Root>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
        <Pagination.Root
          count={members.length}
          pageSize={pageSize}
          page={currentPage}
        >
          <ButtonGroup variant={"ghost"} size="sm" wrap={"wrap"}>
            <Pagination.PrevTrigger asChild>
              <IconButton>
                <Icon as={LuChevronLeft as any}/>
              </IconButton>
            </Pagination.PrevTrigger>
            <Pagination.Items
              render={(page) => (
                <IconButton variant={{ base: "ghost", _selected: "outline"}} onClick={() => setCurrentPage(page.value)}>
                  {page.value}
                </IconButton>
              )}
            />
            <Pagination.NextTrigger asChild>
              <IconButton>
                <Icon as={LuChevronRight as any}/>
              </IconButton>
            </Pagination.NextTrigger>
          </ButtonGroup>
        </Pagination.Root>
      </Stack>
      
    </Box>
  );
};

export default MembersPage;