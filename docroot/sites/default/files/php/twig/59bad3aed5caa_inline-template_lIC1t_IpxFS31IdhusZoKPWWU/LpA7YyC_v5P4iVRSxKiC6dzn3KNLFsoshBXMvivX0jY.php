<?php

/* {# inline_template_start #}<div class="topic-wrapper"><div class="topic-image">{{ field_product_media }}</div><div class="topic-link"><a href="{{  path('entity.taxonomy_term.canonical', {'taxonomy_term': tid}) }}">{{ description__value }}</a></div></div> */
class __TwigTemplate_cdb14977c21a3f0570434bd8393213b56f20ee3edca92bdeca2a56f959ba2af2 extends Twig_Template
{
    public function __construct(Twig_Environment $env)
    {
        parent::__construct($env);

        $this->parent = false;

        $this->blocks = array(
        );
    }

    protected function doDisplay(array $context, array $blocks = array())
    {
        $tags = array();
        $filters = array();
        $functions = array("path" => 1);

        try {
            $this->env->getExtension('Twig_Extension_Sandbox')->checkSecurity(
                array(),
                array(),
                array('path')
            );
        } catch (Twig_Sandbox_SecurityError $e) {
            $e->setSourceContext($this->getSourceContext());

            if ($e instanceof Twig_Sandbox_SecurityNotAllowedTagError && isset($tags[$e->getTagName()])) {
                $e->setTemplateLine($tags[$e->getTagName()]);
            } elseif ($e instanceof Twig_Sandbox_SecurityNotAllowedFilterError && isset($filters[$e->getFilterName()])) {
                $e->setTemplateLine($filters[$e->getFilterName()]);
            } elseif ($e instanceof Twig_Sandbox_SecurityNotAllowedFunctionError && isset($functions[$e->getFunctionName()])) {
                $e->setTemplateLine($functions[$e->getFunctionName()]);
            }

            throw $e;
        }

        // line 1
        echo "<div class=\"topic-wrapper\"><div class=\"topic-image\">";
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, (isset($context["field_product_media"]) ? $context["field_product_media"] : null), "html", null, true));
        echo "</div><div class=\"topic-link\"><a href=\"";
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->env->getExtension('Drupal\Core\Template\TwigExtension')->getPath("entity.taxonomy_term.canonical", array("taxonomy_term" => (isset($context["tid"]) ? $context["tid"] : null))), "html", null, true));
        echo "\">";
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, (isset($context["description__value"]) ? $context["description__value"] : null), "html", null, true));
        echo "</a></div></div>";
    }

    public function getTemplateName()
    {
        return "{# inline_template_start #}<div class=\"topic-wrapper\"><div class=\"topic-image\">{{ field_product_media }}</div><div class=\"topic-link\"><a href=\"{{  path('entity.taxonomy_term.canonical', {'taxonomy_term': tid}) }}\">{{ description__value }}</a></div></div>";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  43 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "{# inline_template_start #}<div class=\"topic-wrapper\"><div class=\"topic-image\">{{ field_product_media }}</div><div class=\"topic-link\"><a href=\"{{  path('entity.taxonomy_term.canonical', {'taxonomy_term': tid}) }}\">{{ description__value }}</a></div></div>", "");
    }
}
