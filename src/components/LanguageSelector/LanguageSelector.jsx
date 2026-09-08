import { useTranslation } from 'react-i18next';
import './LanguageSelector.css';

const LanguageSelector = () => {
	const { t, i18n } = useTranslation('common');
	const currentLanguage = (i18n.resolvedLanguage || i18n.language || 'es').split('-')[0];

	return (
		<label className='languageSelector'>
			<span className='languageSelector__label'>{t('language.label')}</span>
			<select
				className='languageSelector__select'
				value={currentLanguage}
				onChange={(event) => void i18n.changeLanguage(event.target.value)}
				aria-label={t('language.label')}
			>
				<option value='es' aria-label={t('language.es')}>🇪🇸</option>
				<option value='en' aria-label={t('language.en')}>🇺🇸</option>
			</select>
		</label>
	);
};

export { LanguageSelector };
