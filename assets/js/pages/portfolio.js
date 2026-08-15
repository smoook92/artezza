import { portfolioData } from '../data/portfolio-data.js';
import { createPortfolioCard } from '../components/PortfolioCard.js';

document.addEventListener('DOMContentLoaded', () => {
    initPortfolio();
});

function initPortfolio() {
    const page = document.querySelector('.portfolio-page');

    if (!page) {
        return;
    }

    renderPortfolio(portfolioData);
}

function renderPortfolio(projects) {
    const container = document.querySelector(
        '.portfolio-projects__grid'
    );

    if (!container) {
        return;
    }

    container.replaceChildren();

    projects.forEach((project) => {
        container.appendChild(
            createPortfolioCard(project)
        );
    });

    updateProjectsCount(projects.length);
    updateMetaDescription(projects);
}

function updateProjectsCount(count) {
    const element = document.querySelector(
        '.portfolio-projects__count'
    );

    if (!element) {
        return;
    }

    element.textContent = getProjectsCountText(count);
}

function getProjectsCountText(count) {
    if (count === 0) {
        return '0 работ';
    }

    if (count === 1) {
        return '1 работа';
    }

    if (count >= 2 && count <= 4) {
        return `${count} работы`;
    }

    return `${count} работ`;
}

function updateMetaDescription(projects) {
    const meta = document.querySelector(
        'meta[name="description"]'
    );

    if (!meta || !projects.length) {
        return;
    }

    meta.content =
        `Портфолио ARTEZZA — ${projects.length} реализованных ` +
        'проектов с декоративными покрытиями и отделочными материалами.';
}