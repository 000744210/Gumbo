import { get, set } from "lodash-es";
import React, { FC, MouseEventHandler } from "react";
import tw, { styled } from "twin.macro";
import browser from "webextension-polyfill";

import { LANGUAGE_OPTIONS } from "@/common/constants";
import { t } from "@/common/helpers";

import { useFollowedUsers, useSettings } from "@/browser/helpers/hooks";

import Accordion from "../Accordion";
import Button from "../Button";
import CheckboxGrid from "../CheckboxGrid";
import FormField from "../FormField";
import Modal from "../Modal";
import Section from "../Section";
import Select from "../Select";
import Switch from "../Switch";

const StyledAccordion = styled(Accordion)`
  ${tw`mb-3 last:mb-0`}
`;

const StyledSwitch = styled(Switch)`
  ${tw`mb-3 last:mb-0`}
`;

const ButtonGrid = styled.div`
  ${tw`gap-3 grid grid-cols-2 mt-6`}
`;

interface SettingsModalProps {
  onClose?(): void;
  isOpen?: boolean;
}

const SettingsModal: FC<SettingsModalProps> = (props) => {
  const [settings, store] = useSettings();
  const [followedUsers] = useFollowedUsers();

  const register = (path: string) => ({
    value: get(settings, path),
    onChange(value: unknown) {
      store.set(set(settings, path, value));
    },
  });

  const onExportClick: MouseEventHandler<HTMLButtonElement> = async () => {
    const url = URL.createObjectURL(
      new Blob(
        [
          JSON.stringify(
            await browser.runtime.sendMessage({
              type: "backup",
              args: [],
            })
          ),
        ],
        {
          type: "application/json",
        }
      )
    );

    const anchor = document.createElement("a");

    anchor.setAttribute("download", `Gumbo-${Date.now()}.json`);
    anchor.setAttribute("href", url);
    anchor.click();

    URL.revokeObjectURL(url);
  };

  const onImportClick: MouseEventHandler<HTMLButtonElement> = async () => {
    const input = document.createElement("input");

    input.addEventListener("change", async () => {
      const file = input.files?.item(0);

      if (file?.type === "application/json") {
        const data = JSON.parse(await file.text());

        await browser.runtime.sendMessage({
          type: "restore",
          args: [data],
        });
      }
    });

    input.setAttribute("type", "file");
    input.click();
  };

  return (
    <Modal isOpen={props.isOpen} title={t("settings")} onClose={props.onClose}>
      <StyledAccordion title={t("general")}>
        <Section>
          <FormField title={t("fontSize")}>
            <Select
              {...register("general.fontSize")}
              fullWidth
              options={[
                {
                  label: t("smallest"),
                  value: "smallest",
                },
                {
                  label: t("small"),
                  value: "small",
                },
                {
                  label: t("medium"),
                  value: "medium",
                },
                {
                  label: t("large"),
                  value: "large",
                },
                {
                  label: t("largest"),
                  value: "largest",
                },
              ]}
            />
          </FormField>
          <FormField title={t("theme")}>
            <Select
              {...register("general.theme")}
              fullWidth
              options={[
                {
                  label: t("dark"),
                  value: "dark",
                },
                {
                  label: t("light"),
                  value: "light",
                },
              ]}
            />
          </FormField>
          <StyledSwitch {...register("general.withBadge")}>{t("showIconBadge")}</StyledSwitch>
        </Section>
      </StyledAccordion>

      <StyledAccordion title={t("notifications")}>
        <Section>
          <StyledSwitch {...register("notifications.enabled")}>
            {t("enableNotifications")}
          </StyledSwitch>
          <StyledSwitch
            {...register("notifications.withFilters")}
            disabled={!settings.notifications.enabled}
          >
            {t("filterNotificationsByChannel")}
          </StyledSwitch>
        </Section>
        <Section>
          <CheckboxGrid
            {...register("notifications.selectedUsers")}
            disabled={!settings.notifications.enabled || !settings.notifications.withFilters}
            options={followedUsers.map((user) => ({
              title: user.display_name || user.login,
              value: user.id,
            }))}
          />
        </Section>
      </StyledAccordion>

      <StyledAccordion title={t("search")}>
        <Section title={t("channels")}>
          <StyledSwitch {...register("channels.liveOnly")}>
            {t("showLiveChannelsOnly")}
          </StyledSwitch>
        </Section>
      </StyledAccordion>

      <StyledAccordion title={t("streams")}>
        <Section>
          <StyledSwitch {...register("streams.withReruns")}>
            {t("showRerunsInFollowedStreams")}
          </StyledSwitch>
          <StyledSwitch {...register("streams.withFilters")}>
            {t("filterStreamsByLanguage")}
          </StyledSwitch>
        </Section>
        <Section>
          <CheckboxGrid
            {...register("streams.selectedLanguages")}
            disabled={!settings.streams.withFilters}
            options={LANGUAGE_OPTIONS}
          />
        </Section>
      </StyledAccordion>

      <ButtonGrid>
        <Button
          onClick={onImportClick}
          icon={
            <svg viewBox="0 0 24 24">
              <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
              <polyline points="7 9 12 4 17 9" />
              <line x1="12" y1="4" x2="12" y2="16" />
            </svg>
          }
        >
          {t("importSettings")}
        </Button>
        <Button
          onClick={onExportClick}
          icon={
            <svg viewBox="0 0 24 24">
              <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
              <polyline points="7 11 12 16 17 11" />
              <line x1="12" y1="4" x2="12" y2="16" />
            </svg>
          }
        >
          {t("exportSettings")}
        </Button>
      </ButtonGrid>
    </Modal>
  );
};

export default SettingsModal;
