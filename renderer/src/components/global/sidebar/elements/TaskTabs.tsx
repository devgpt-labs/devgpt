import React, { useState, useEffect } from "react";
import { Box, useToast } from "@chakra-ui/react";
import { AiOutlineDelete } from "react-icons/ai";
import { FiMessageSquare } from "react-icons/fi";
import router from "next/router";

import deleteTask from "@/src/utils/deleteTask";
import NavItem from "../../navigation/NavItem";
import { useAuthContext } from "@/src/context";
import getTasks from "@/src/utils/getTasks";

interface TaskTabsProps {
  tasks: any;
  setTasks: any;
  refresh: boolean;
  setRefresh: any;
}

const TaskTabs = ({ tasks, setTasks, refresh, setRefresh }: TaskTabsProps) => {
  const [tasksLoaded, setTasksLoaded] = useState(false);

  const { user } = useAuthContext();
  const toast = useToast();

  // Get tasks initial
  useEffect(() => {
    if (!user) return;
    getTasks(user?.id, toast).then((tasks: any) => {
      setTasksLoaded(false);
      tasks.reverse();
      setTasks(tasks);
      setTasksLoaded(true);
    });
  }, [refresh, user]);

  return (
    <Box>
      {tasks.length === 0 ? (
        <NavItem iconColor="white">
          {tasksLoaded ? "No tasks found yet" : "Loading tasks..."}
        </NavItem>
      ) : (
        tasks?.map((task: any, index: any) => {
          return (
            <NavItem
              key={index}
              icon={FiMessageSquare}
              iconColor="white"
              bgColor={
                task?.transaction_id === router.query.id
                  ? "gray.700"
                  : "gray.900"
              }
              borderRadius={0}
              secondIcon={
                <Box
                  mr={4}
                  onClick={(e) => {
                    e.stopPropagation();

                    deleteTask(task.transaction_id, toast, refresh, setRefresh);
                  }}
                >
                  <AiOutlineDelete color={"#E53E3E"} />
                </Box>
              }
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/platform/transactions/${task?.transaction_id}`);
              }}
              hoverText={task?.input}
            >
              {`${task.input.substring(0, 30)}...`}
            </NavItem>
          );
        })
      )}
    </Box>
  );
};

export default TaskTabs;
