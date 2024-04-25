import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useHistory } from "react-router";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";

function Homepage() {
  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) history.push("/chats");
  }, [history]);

  return (
    <Box bg="#f5f5f5" minHeight="100vh" display="flex" justifyContent="center" alignItems="center">
      <Container
        className="card"
        p={8}
        borderRadius="20px"
        boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
        transition="transform 0.3s"
        _hover={{ transform: "scale(1.02)" }}
        maxW="xl"
        width="100%"
      >
        <Box textAlign="center" mb={8}>
          <Text fontSize="4xl" fontWeight="bold" color="#ffffff" bg="teal.500" p={4} borderRadius="10px">Roomie</Text>
        </Box>
        <Tabs isFitted variant="unstyled">
          <TabList mb="1em" borderBottom="1px solid teal">
            <Tab _selected={{ color: 'teal.500', borderBottom: '2px solid teal.500' }}>Login</Tab>
            <Tab _selected={{ color: 'teal.500', borderBottom: '2px solid teal.500' }}>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </Box>
  );
}

export default Homepage;
