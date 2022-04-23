import * as React from 'react';
import {
  Flex, Input, Text, useDisclosure, useToast,
} from "@chakra-ui/react";
import { PageHeader } from '../../components/PageHeader';
import { SearchInput } from '../../components/inputs/Search';
import { useApi } from '../../hooks/useApi';
import { Project, SERVERROLE as Role } from '../../client';
import { ProjectItem } from '../../components/items/Project';
import { Confirm } from '../../components/Confirm';
import { AnimatePresence } from 'framer-motion';
import { CreateProject } from '../../forms/CreateProject';
import { useRole } from '../../hooks/useRole';
import { useStores } from '../../stores';

export const ProjectsPage = () => {
  const [search, setSearch] = React.useState<string>('');
  const [projects, setProjects] = React.useState<Project[] | undefined>(undefined);
  const [shouldRefresh, setRefresh] = React.useState<number>(0);
  const [dialog, setDialog] = React.useState<number>(0);
  const [selected, setSelected] = React.useState<Project | undefined>(undefined);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {appStore} = useStores();
  const refresh = () => setRefresh(shouldRefresh + 1);
  const remove = (project: Project) => {
    setSelected(project);
    setDialog(1);
  }

  const toast = useToast();

  const {projectApi} = useApi();
  const removeItem = () => projectApi.projectsRemove(selected?.id!!).then((response) => {
    if (response.status === 200) {
      setDialog(0)
      setSelected(undefined);
      refresh();
      toast({
        title: 'project deleted',
        isClosable: true,
        status: 'success',
        position: 'top',
        duration: 5000,
      });
    }
  });

  React.useEffect(() => {
    appStore.refresh();
    projectApi.projectsFindAll().then(response => {
      console.log(response)
      if (response.status === 200 && response.data.data) {
        setProjects(response.data.data as Project[]);
        setTimeout(appStore.refreshed, 1000);
      }
    }).catch(err => {
      console.log(err)
      toast({
        title: 'Items cannot be loaded',
        description: 'Try to refresh',
        isClosable: true,
        position: 'top',
        status: 'error'
      });
      setTimeout(appStore.refreshed, 1000);
    });
  }, [shouldRefresh]);

  const projectList = projects?.filter(project => project.name.includes(search))
    .map((project) => (
      <ProjectItem item={project} remove={() => remove(project)} key={project.id} />
    )) || [];

  return (
    <Flex w="100%" h="100%" flexDirection="column">
      <PageHeader title='Projects' refresh={refresh} create={onOpen} />
      <SearchInput value={search} setValue={setSearch} />
      <Flex w="100%" h="68%" direction="column" overflowX="hidden" overflowY="auto"
        sx={{
          '&::-webkit-scrollbar': {
            width: '16px',
            borderRadius: '8px',
            backgroundColor: `rgba(255, 255, 255, 0.2)`,
          },'&::-webkit-scrollbar-track': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: `rgba(0, 0, 0, 0.3)`,
            borderRadius: '8px',

          },
        }}
        >
        <AnimatePresence>
          {projectList}
        </AnimatePresence>
      </Flex>
      <Confirm title='Delete invitation'
        description={`Are you sure you want to delete the project named ${selected?.name}? You can't undo this action afterwards.`}
        actionName='Delete'
        isOpen={selected !== undefined && dialog === 1}
        onClose={() => setDialog(0)}
        action={removeItem} />
      <CreateProject isOpen={isOpen} onClose={onClose} refresh={refresh} />
    </Flex>
  );
}