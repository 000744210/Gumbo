import React, { FC } from "react";
import tw, { styled } from "twin.macro";

import { t } from "@/common/helpers";

import ExternalAnchor from "../ExternalAnchor";
import Hero from "../Hero";
import Modal from "../Modal";
import Section from "../Section";

const LinkList = styled.div`
  ${tw`flex flex-wrap justify-center -mx-3`}
`;

const Link = styled(ExternalAnchor)`
  ${tw`mx-3`}
`;

interface AboutModalProps {
  onClose?(): void;
  isOpen?: boolean;
}

const AboutModal: FC<AboutModalProps> = (props) => (
  <Modal isOpen={props.isOpen} onClose={props.onClose}>
    <Section>
      <Hero />
    </Section>
    <Section>
      <LinkList>
        <Link href="https://github.com/seldszar/gumbo">{t("repository")}</Link>
        <Link href="https://github.com/seldszar/gumbo/issues">{t("support")}</Link>
        <Link href="https://github.com/seldszar/gumbo/releases">{t("releaseNotes")}</Link>
      </LinkList>
    </Section>
  </Modal>
);

export default AboutModal;
