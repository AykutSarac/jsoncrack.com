import React from "react";
import Head from "next/head";
import { Anchor, Container, Paper, Stack, Text, Title } from "@mantine/core";
import Layout from "src/layout/Layout";

const Terms = () => {
  return (
    <Layout>
      <Head>
        <title>Terms of Service - JSON Crack</title>
      </Head>
      <Container my={50} size="sm" pb="lg">
        <Paper bg="transparent">
          <Title c="gray.8">Terms of Service</Title>
          <Stack my="lg">
            <Text c="gray.8">
              Subject to these Terms of Service (this &apos;Agreement&apos;), jsoncrack.com
              (&apos;JSON Crack&apos;, &apos;we&apos;, &apos;us&apos; and/or &apos;our&apos;)
              provides access to JSON Crack’s application as a service (collectively, the
              &apos;Services&apos;). By using or accessing the Services, you acknowledge that you
              have read, understand, and agree to be bound by this Agreement.
            </Text>

            <Text c="gray.8">
              If you are entering into this Agreement on behalf of a company, business or other
              legal entity, you represent that you have the authority to bind such an entity to this
              Agreement, in which case the term &apos;you&apos; shall refer to such entity. If you
              do not have such authority, or if you do not agree with this Agreement, you must not
              accept this Agreement and may not use the Services.
            </Text>

            <Title order={3} c="gray.8">
              1. Acceptance of Terms
            </Title>
            <Text c="gray.8">
              By signing up and using the services provided by JSON Crack (referred to as the
              &apos;Service&apos;), you are agreeing to be bound by the following terms and
              conditions (&apos;Terms of Service&apos;). The Service is owned and operated by JSON
              Crack (&apos;Us&apos;, &apos;We&apos;, or &apos;Our&apos;).
            </Text>
            <Title order={3} c="gray.8">
              2. Description of Service
            </Title>
            <Text c="gray.8">
              JSON Crack is an open-source visualization application that allows users to transform
              various data formats, including JSON, YAML, XML, CSV, and more, into interactive
              graphs for visualization purposes (the “Product”). The Product is accessible at
              jsoncrack.com and other domains and subdomains controlled by Us (collectively,
              &apos;the Website&apos;).
            </Text>
            <Title order={3} c="gray.8">
              3. Fair Use
            </Title>
            <Text c="gray.8">
              We reserve the right to suspend or terminate your access to the Service if we
              determine, in our sole discretion, that you have violated these Terms of Service,
              including but not limited to, purposefully advertising of third parties, spam content,
              or other inappropriate or illegal content.
            </Text>
            <Title order={3} c="gray.8">
              4. Intellectual Property Rights
            </Title>
            <Text c="gray.8">
              You acknowledge and agree that the Service and its entire contents, features, and
              functionality, including but not limited to all information, software, code, text,
              displays, graphics, photographs, video, audio, design, presentation, selection, and
              arrangement, are owned by Us, our licensors, or other providers of such material and
              are protected by United States and international copyright, trademark, patent, trade
              secret, and other intellectual property or proprietary rights laws.
            </Text>
            <Title order={3} c="gray.8">
              5. Data Storage and Privacy
            </Title>
            <Text c="gray.8">
              We do not guarantee the security, reliability, consistency and/or recovery of any data
              stored in the Product and do not recommend storing sensitive data. The Product enables
              users to store data for visualization purposes as an ease of access only. When a file
              is deleted from the Product, it is also permanently removed from the database (refer
              as hard deletion).
            </Text>
            <Title order={3} c="gray.8">
              6. Changes to these Terms
            </Title>
            <Text c="gray.8">
              We reserve the right to revise and update these Terms of Service from time to time in
              our sole discretion. All changes are effective immediately when we post them, and
              apply to all access to and use of the Website thereafter. Your continued use of the
              Website following the posting of revised Terms of Service means that you accept and
              agree to the changes.
            </Text>
            <Title order={3} c="gray.8">
              7. Contact Information
            </Title>
            <Text c="gray.8">
              Questions or comments about the Website or these Terms of Service may be directed to
              our support team at{" "}
              <Anchor href="mailto:contact@jsoncrack.com">contact@jsoncrack.com</Anchor>.
            </Text>
            <Title order={3} c="gray.8">
              8. Disclaimer of Warranties
            </Title>
            <Text c="gray.8">
              THE SERVICE AND ITS CONTENT ARE PROVIDED ON AN &apos;AS IS&apos; AND &apos;AS
              AVAILABLE&apos; BASIS WITHOUT ANY WARRANTIES OF ANY KIND. WE DISCLAIM ALL WARRANTIES,
              INCLUDING, BUT NOT LIMITED TO, THE WARRANTY OF TITLE, MERCHANTABILITY,
              NON-INFRINGEMENT OF THIRD PARTIES’ RIGHTS, AND FITNESS FOR PARTICULAR PURPOSE.
            </Text>
            <Text c="gray.8">
              IN NO EVENT WILL WE, OUR AFFILIATES OR THEIR LICENSORS, SERVICE PROVIDERS, EMPLOYEES,
              AGENTS, OFFICERS OR DIRECTORS BE LIABLE FOR DAMAGES OF ANY KIND, UNDER ANY LEGAL
              THEORY, ARISING OUT OF OR IN CONNECTION WITH YOUR USE, OR INABILITY TO USE, THE
              WEBSITE, THE SERVICE, ANY WEBSITES LINKED TO IT, ANY CONTENT ON THE WEBSITE OR SUCH
              OTHER WEBSITES, INCLUDING ANY DIRECT, INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, OR
              PUNITIVE DAMAGES.
            </Text>
          </Stack>
        </Paper>
      </Container>
    </Layout>
  );
};

export default Terms;
