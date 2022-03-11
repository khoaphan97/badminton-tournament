import React, { FC } from 'react'
import { Radio, RadioChangeEvent } from 'antd'
import { SideBarItem, SideBarStyled } from './styled'
import { Content, TournamentSchema } from '@data/Tournament'

type Props = {
    tournament: TournamentSchema;
    activeTab: Content;
    changeActiveContent: (contentType: Content) => void;
    handleActiveContent: (name: string, checked: boolean) => void;
}

const contentList = [
    {
        key: 'menSingle',
        content: Content.MAN_SINGLE,
        label: 'Đơn nam'
    },
    {
        key: 'womenSingle',
        content: Content.WOMAN_SINGLE,
        label: 'Đơn nữ'
    },
    {
        key: 'menDouble',
        content: Content.MAN_DOUBLE,
        label: 'Đôi nam'
    },
    {
        key: 'womenDouble',
        content: Content.WOMAN_DOUBLE,
        label: 'Đôi nữ'
    },
    {
        key: 'mixedDouble',
        content: Content.MIXED_DOUBLE,
        label: 'Đôi nam/nữ'
    },
]

const SideBar: FC<Props> = ({
    tournament,
    activeTab,
    changeActiveContent,
    handleActiveContent
}) => {

    const getEnable = (key: string) => {
        switch (key) {
            case 'menSingle':
                return tournament.menSingle.enabled;
            case 'menDouble':
                return tournament.menDouble.enabled;
            case 'womenSingle':
                return tournament.womenSingle.enabled;
            case 'womenDouble':
                return tournament.womenDouble.enabled;
            case 'mixedDouble':
                return tournament.mixedDouble.enabled;
        }
    }

    return (
        <SideBarStyled>
            {
                contentList.map((item, index) => (
                    <SideBarItem
                        key={`${item.key}-${index}`}
                        className={activeTab === item.content ? 'active' : ''}
                        disabled={!getEnable(item.key)}
                    >
                        <Radio
                            onClick={() => handleActiveContent(item.key, !getEnable(item.key))}
                            checked={getEnable(item.key)}
                            name={item.key}
                        />
                        <span
                            onClick={() => changeActiveContent(item.content)}
                            className='content-label'
                        >
                            {item.label}
                        </span>
                    </SideBarItem>
                ))
            }
        </SideBarStyled>
    )
}

export default SideBar