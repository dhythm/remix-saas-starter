import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  Radio,
  RadioGroup,
  SimpleGrid,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useSearchParams } from "@remix-run/react";
// import { Form, json, useActionData, useSearchParams } from "remix";
import { Blur } from "~/components";
import { createUserSession, login } from "~/utils/session.server";

function validateOrganizationCode(organizationCode: unknown) {
  if (typeof organizationCode !== "string" || organizationCode.length < 3) {
    return `Organization Code must be at least 3 characters long`;
  }
}

function validateEmail(email: unknown) {
  if (typeof email !== "string" || email.length < 3) {
    return `Email must be at least 3 characters long`;
  }
}

function validatePassword(password: unknown) {
  if (typeof password !== "string" || password.length < 6) {
    return `Password must be at least 6 characters long`;
  }
}

type ActionData = {
  formError?: string;
  fieldErrors?: {
    organizationCode: string | undefined;
    email: string | undefined;
    password: string | undefined;
  };
  fields?: {
    loginType: string;
    organizationCode: string;
    email: string;
    password: string;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const loginType = form.get("loginType");
  const organizationCode = form.get("organizationCode");
  const email = form.get("email");
  const password = form.get("password");
  const redirectTo = form.get("redirectTo") || "/";

  if (
    typeof loginType !== "string" ||
    typeof organizationCode !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof redirectTo !== "string"
  ) {
    return badRequest({
      formError: `Form not submitted correctly.`,
    });
  }
  const fields = { loginType, organizationCode, email, password };
  const fieldErrors = {
    organizationCode: validateOrganizationCode(organizationCode),
    email: validateEmail(email),
    password: validatePassword(password),
  };
  if (Object.values(fieldErrors).some(Boolean))
    return badRequest({ fieldErrors, fields });

  switch (loginType) {
    case "login": {
      const user = await login({ organizationCode, email, password });
      if (!user) {
        return badRequest({
          fields,
          formError: `OrganizationCode/Email/Password combination is incorrect`,
        });
      }
      return createUserSession(user.id, redirectTo);
    }
    // case "register": {
    //   const user = await register(request, { username, password });
    //   if (!user) {
    //     return badRequest({
    //       fields,
    //       formError: `User with username ${username} already exists`,
    //       // formError: `Something went wrong trying to create a new user.`,
    //     });
    //   }
    //   return createUserSession(user.id, redirectTo);
    // }
    default: {
      return badRequest({
        fields,
        formError: "Login type invalid",
      });
    }
  }
};

export default function Login() {
  const actionData = useActionData<ActionData>();
  const [searchParams] = useSearchParams();
  const size = useBreakpointValue({ base: "md", md: "lg" });
  const width = useBreakpointValue({ base: "44px", md: "60px" });
  const height = useBreakpointValue({ base: "44px", md: "60px" });

  return (
    <Box position={"relative"}>
      <Container
        as={SimpleGrid}
        maxW={"7xl"}
        columns={{ base: 1, md: 2 }}
        spacing={{ base: 10, lg: 32 }}
        py={{ base: 10, sm: 20, lg: 32 }}
      >
        <Stack spacing={{ base: 10, md: 20 }}>
          <Heading
            lineHeight={1.1}
            fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" }}
          >
            Enjoy learning yourself{" "}
            <Text
              as={"span"}
              bgGradient="linear(to-r, red.400,pink.400)"
              bgClip="text"
            >
              &
            </Text>{" "}
            Learn with your friends
          </Heading>
          <Stack direction={"row"} spacing={4} align={"center"}>
            <AvatarGroup>
              {avatars.map((avatar) => (
                <Avatar
                  key={avatar.name}
                  name={avatar.name}
                  src={avatar.url}
                  size={size}
                  position={"relative"}
                  zIndex={2}
                  _before={{
                    content: '""',
                    width: "full",
                    height: "full",
                    rounded: "full",
                    transform: "scale(1.125)",
                    bgGradient: "linear(to-bl, red.400,pink.400)",
                    position: "absolute",
                    zIndex: -1,
                    top: 0,
                    left: 0,
                  }}
                />
              ))}
            </AvatarGroup>
            <Text fontFamily={"heading"} fontSize={{ base: "4xl", md: "6xl" }}>
              +
            </Text>
            <Flex
              align={"center"}
              justify={"center"}
              fontFamily={"heading"}
              fontSize={{ base: "sm", md: "lg" }}
              bg={"gray.800"}
              color={"white"}
              rounded={"full"}
              width={width}
              height={height}
              position={"relative"}
              _before={{
                content: '""',
                width: "full",
                height: "full",
                rounded: "full",
                transform: "scale(1.125)",
                bgGradient: "linear(to-bl, orange.400,yellow.400)",
                position: "absolute",
                zIndex: -1,
                top: 0,
                left: 0,
              }}
            >
              YOU
            </Flex>
          </Stack>
        </Stack>
        <Stack
          bg={"gray.50"}
          rounded={"xl"}
          p={{ base: 4, sm: 6, md: 8 }}
          spacing={{ base: 8 }}
          maxW={{ lg: "lg" }}
        >
          <Stack spacing={4}>
            <Heading
              color={"gray.800"}
              lineHeight={1.1}
              fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
            >
              Login or Register
              <Text
                as={"span"}
                bgGradient="linear(to-r, red.400,pink.400)"
                bgClip="text"
              >
                !
              </Text>
            </Heading>
            <Text color={"gray.500"} fontSize={{ base: "sm", sm: "md" }}>
              We’re looking for amazing engineers just like you! Become a part
              of our rockstar engineering team and skyrocket your career!
            </Text>
          </Stack>
          <Box mt={10}>
            <Form method="post">
              <Input
                type="hidden"
                name="redirectTo"
                value={searchParams.get("redirectTo") ?? undefined}
              />
              <Stack spacing={4}>
                <FormControl as="fieldset">
                  <FormLabel as="legend">Login or Register?</FormLabel>
                  <RadioGroup
                    name="loginType"
                    defaultValue={
                      actionData?.fields?.loginType === "register"
                        ? "register"
                        : "login"
                    }
                  >
                    <HStack spacing="24px">
                      <Radio value="login">Login</Radio>
                    </HStack>
                  </RadioGroup>
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={Boolean(actionData?.fieldErrors?.email)}
                >
                  <FormLabel>Organization Code</FormLabel>
                  <Input
                    id="organizationCode"
                    name="organizationCode"
                    type="text"
                    placeholder="0000"
                    bg={"gray.100"}
                    border={0}
                    color={"gray.500"}
                    _placeholder={{
                      color: "gray.500",
                    }}
                    defaultValue={actionData?.fields?.organizationCode}
                    aria-invalid={Boolean(
                      actionData?.fieldErrors?.organizationCode
                    )}
                    aria-errormessage={
                      actionData?.fieldErrors?.organizationCode
                        ? "organizationCode-error"
                        : undefined
                    }
                  />
                  <FormErrorMessage>
                    {actionData?.fieldErrors?.organizationCode}
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={Boolean(actionData?.fieldErrors?.email)}
                >
                  <FormLabel>Email</FormLabel>
                  <Input
                    id="email"
                    name="email"
                    type="text"
                    placeholder="example@test.remix.run"
                    bg={"gray.100"}
                    border={0}
                    color={"gray.500"}
                    _placeholder={{
                      color: "gray.500",
                    }}
                    defaultValue={actionData?.fields?.email}
                    aria-invalid={Boolean(actionData?.fieldErrors?.email)}
                    aria-errormessage={
                      actionData?.fieldErrors?.email ? "email-error" : undefined
                    }
                  />
                  <FormErrorMessage>
                    {actionData?.fieldErrors?.email}
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={Boolean(actionData?.fieldErrors?.password)}
                >
                  <FormLabel>Password</FormLabel>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="password"
                    bg={"gray.100"}
                    border={0}
                    color={"gray.500"}
                    _placeholder={{
                      color: "gray.500",
                    }}
                    defaultValue={actionData?.fields?.password}
                    aria-invalid={
                      Boolean(actionData?.fieldErrors?.password) || undefined
                    }
                    aria-errormessage={
                      actionData?.fieldErrors?.password
                        ? "password-error"
                        : undefined
                    }
                  />
                  <FormErrorMessage>
                    {actionData?.fieldErrors?.password}
                  </FormErrorMessage>
                </FormControl>
                {actionData?.formError ? (
                  <FormControl isInvalid={Boolean(actionData.formError)}>
                    <FormErrorMessage>{actionData.formError}</FormErrorMessage>
                  </FormControl>
                ) : null}
              </Stack>
              <Button
                fontFamily={"heading"}
                mt={8}
                w={"full"}
                bgGradient="linear(to-r, red.400,pink.400)"
                color={"white"}
                _hover={{
                  bgGradient: "linear(to-r, red.400,pink.400)",
                  boxShadow: "xl",
                }}
                type="submit"
              >
                Submit
              </Button>
            </Form>
          </Box>
        </Stack>
      </Container>
      <Blur
        position={"absolute"}
        top={-10}
        left={-10}
        style={{ filter: "blur(70px)" }}
      />
    </Box>
  );
}

const avatars = [
  {
    name: "Ryan Florence",
    url: "https://bit.ly/ryan-florence",
  },
  {
    name: "Segun Adebayo",
    url: "https://bit.ly/sage-adebayo",
  },
  {
    name: "Kent Dodds",
    url: "https://bit.ly/kent-c-dodds",
  },
  {
    name: "Prosper Otemuyiwa",
    url: "https://bit.ly/prosper-baba",
  },
  {
    name: "Christian Nwamba",
    url: "https://bit.ly/code-beast",
  },
];
